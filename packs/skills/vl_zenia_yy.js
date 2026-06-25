import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init(player) {
        if (!player.vl_zenia_yy) player.vl_zenia_yy = '平';
    },
    filterTarget: true,
    mark: true,
    marktext: "🎶",
    intro: {
        content(storage, player) {
            let str;
            switch (player.vl_zenia_yy) {
                case '平': str = '出牌阶段限一次，你可以令一名角色摸' + player.maxHp + '张牌，然后弃置' + player.hp + '张手牌。'; break;
                case '仄': str = '出牌阶段限一次，你可以令一名角色弃置' + player.maxHp + '张手牌，然后摸' + player.hp + '张牌。'; break;
            }
            return '<li>当前韵律：' + (player.vl_zenia_yy || '平') + '<br><li>' + str;
        },
    },
    group: "vl_zenia_yy_zhuanyun",
    yunlvSkill: true,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
        switch (player.vl_zenia_yy || '平') {
            case '平':
                await event.target.draw(player.maxHp);
                await event.target.chooseToDiscard(player.hp, 'h', true)
                break;
            case '仄':
                await event.target.chooseToDiscard(player.maxHp, 'h', true)
                await event.target.draw(player.hp);
                break;
        }
    },
    ai: {
        order: 7,
        result: {
            target(player, target) {
                if (player.hp == player.maxHp) {
                    return 1
                } else if (player.hp != player.maxHp) {
                    if (player.vl_zenia_yy == '仄' && target.countCards('h') > player.hp && target.countCards('h') < player.maxHp) {
                        return -1
                    }
                    return 1;
                }
            },
        },
    },
    subSkill: {
        zhuanyun: {
            trigger: {
                player: "vl_zenia_ysAfter",
            },
            forced: true,
            locked: false,
            async content(event, trigger, player) {
                player.changeYun('vl_zenia_yy');
            },
            sub: true,
        },
    },
    t: {
        name: "余音",
        info: `${get.poptip("yunlvji")}。出牌阶段限一次，<li>平：你可以令一名角色摸X张牌，然后弃置Y张手牌。<li>仄：你可以令一名角色弃置X张手牌，然后摸Y张牌（X为你的体力上限，Y为你的体力值）。<li>转韵：你发动〖韵生〗结算完毕后。`,
    },
};
