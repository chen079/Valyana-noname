import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "gainBegin",
    },
    forced: true,
    filter(event, player) {
        if (event.source != player) return false;
        if (event.player == player) return false;
        return true;
    },
    async content(event, trigger, player) {
        const result = await trigger.player.chooseToDiscard('he', '弃置一张牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
            if (_status.event.goon) return 7 - get.value(card);
            return -get.value(card);
        }).set('goon', get.attitude(trigger.player, player) < 0).forResult();
        if (!result.bool) await player.draw();
    },
    group: ["vl_peterlk_jn_1", "vl_peterlk_jn_2"],
    subSkill: {
        "1": {
            trigger: {
                player: "phaseDrawBegin2",
            },
            frequent: true,
            filter(event, player) {
                return !event.numFixed;
            },
            async content(event, trigger, player) {
                trigger.num += player.getDamagedHp();
            },
            ai: {
                threaten: 1.3,
            },
            sub: true,
        },
        "2": {
            mod: {
                maxHandcardBase(player, num) {
                    return player.maxHp;
                },
            },
            sub: true,
        },
    },
    t: {
        name: "亟难",
        info: "锁定技，你的手牌上限等于你的体力上限，且摸牌阶段你多摸X张牌（X为你的已损体力值）；其他角色获得你的牌时须选择一项：1.令你摸一张牌，2.弃置一张牌。",
    },
};
