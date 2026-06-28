import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterCard: true,
    filterTarget: true,
    usable: 1,
    position: "he",
    async content(event, trigger, player) {
        const target = event.target
        await target.damage(1, player);
        const num = [1, 2].randomGet();
        if (num == 1) {
            await target.draw(2);
            await player.draw(2);
        } else {
            if (!target.getStorage('vl_aak_yj_1', 0)) target.setStorage('vl_aak_yj_1', 0);
            target.setStorage('vl_aak_yj_1', target.getStorage('vl_aak_yj_1', 0) + 1);
            if (!player.getStorage('vl_aak_yj_1', 0)) player.setStorage('vl_aak_yj_1', 0);
            player.setStorage('vl_aak_yj_1', player.getStorage('vl_aak_yj_1', 0) + 1);
            target.addTempSkill('vl_aak_yj_1');
            player.addTempSkill('vl_aak_yj_1');
        }
    },
    ai: {
        order: 7,
        result: {
            target(player, target) {
                if (target.hp == 1) {
                    return -1
                } else {
                    return 0.5
                }
            },
            player: 1,
        },
    },
    subSkill: {
        "1": {
            onremove(player) {
                player.setStorage('vl_aak_yj_1', 0)
            },
            mark: true,
            forced: true,
            unique: true,
            intro: {
                content: "你可以额外使用#张杀",
            },
            mod: {
                cardUsable(card, player, num) {
                    if (card.name == 'sha') return num + player.getStorage('vl_aak_yj_1', 0);
                },
            },
            sub: true,
        },
    },
    t: {
        name: "药剂",
        info: "出牌阶段限一次，你可以弃置一张牌对一名角色造成1点伤害，然后你与其随机执行相同一项：<li>①你摸两张牌。<li>②直至回合结束，出牌阶段可以多使用一张【杀】。",
    },
};
