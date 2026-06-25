import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    forced: true,
    mark: true,
    intro: {
        content(event, player) {
            if (player.hasSkill('vl_yinhu_xr')) {
                return "摸牌阶段，你多摸两张牌；出牌阶段，你可以额外使用一张【杀】且你的【杀】无距离限制；"
            }
            return "摸牌阶段，你多摸一张牌；出牌阶段，你可以额外使用一张【杀】且你的【杀】无距离限制；"
        },
    },
    trigger: {
        player: "phaseDrawBegin2",
    },
    preHidden: true,
    popup: false,
    filter(event, player) {
        return !event.numFixed;
    },
    async content(event, trigger, player) {
        if (player.hasSkill('vl_yinhu_xr')) {
            trigger.num += 1
        }
        trigger.num += 1;
    },
    group: ["vl_zhufu_1"],
    ai: {
        threaten: 1.5,
    },
    subSkill: {
        "1": {
            forced: true,
            unique: true,
            mod: {
                cardUsable(card, player, num) {
                    if (card.name == 'sha') return num + 1;
                },
                targetInRange(card) {
                    if (card.name == 'sha') return true;
                },
            },
            sub: true,
        },
    },
    t: {
        name: "祝福",
        info: "锁定技。摸牌阶段，你多摸一张牌，若你拥有〖祥瑞〗，则改为两张；出牌阶段，你使用【杀】无距离限制且次数+1；你的判定会朝着对你有利的方向倾斜。",
    },
};
