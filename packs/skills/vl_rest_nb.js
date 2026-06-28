import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    unique: true,
    filter(event, player) {
        return player.getStorage('vl_rest_qf', []).length >= 2;
    },
    prompt: "移去两张“孽”并视为使用任意基本牌或普通锦囊牌使用",
    async content(event, trigger, player) {
        const storage = player.getStorage('vl_rest_qf', []);
        const result = await player.chooseCardButton(2, '移去两张“孽”并当视为使用任意基本牌或普通锦囊牌使用', storage, true).forResult();
        if (!result.bool) return;
        player.$throw(result.links);
        for (let i = 0; i < result.links.length; i++) {
            storage.remove(result.links[i]);
        }
        game.cardsDiscard(storage);
        player.syncStorage('vl_rest_qf');
        const list = [];
        for (let i = 0; i < lib.inpile.length; i++) {
            const name = lib.inpile[i];
            const type = get.type(name);
            if (type == 'trick' || type == 'basic') {
                if (lib.filter.cardEnabled({ name: name }, player)) {
                    list.push([get.translation(type), '', name]);
                }
            }
        }
        const dialog = ui.create.dialog('孽变', [list, 'vcard']);
        let taoyuan = 0;
        let nanman = 0;
        const players = game.filterPlayer();
        for (let i = 0; i < players.length; i++) {
            const eff1 = get.effect(players[i], { name: 'taoyuan' }, player, player);
            const eff2 = get.effect(players[i], { name: 'nanman' }, player, player);
            if (eff1 > 0) {
                taoyuan++;
            } else if (eff1 < 0) {
                taoyuan--;
            }
            if (eff2 > 0) {
                nanman++;
            } else if (eff2 < 0) {
                nanman--;
            }
        }
        const choose = await player.chooseButton(dialog).set('ai', function (button) {
            const name = button.link[2];
            if (Math.max(taoyuan, nanman) > 1) {
                if (taoyuan > nanman) return name == 'taoyuan' ? 1 : 0;
                return name == 'nanman' ? 1 : 0;
            }
            if (player.countCards('h') < player.hp && player.hp >= 2) {
                return name == 'wuzhong' ? 1 : 0;
            }
            if (player.hp < player.maxHp && player.hp < 3) {
                return name == 'tao' ? 1 : 0;
            }
            return name == 'zengbin' ? 1 : 0;
        }).forResult();
        if (choose.bool) {
            player.chooseUseTarget(true, choose.links[0][2]);
        }
    },
    ai: {
        fireAttack: true,
        respondSha: true,
        respondShan: true,
        order: 1,
        result: {
            player(player) {
                if (_status.event.dying) return get.attitude(player, _status.event.dying);
                return 1;
            },
        },
    },
    t: {
        name: "孽变",
        info: "出牌阶段，你可以移去两张“孽”并视为使用任意基本牌或普通锦囊牌。",
    },
};
