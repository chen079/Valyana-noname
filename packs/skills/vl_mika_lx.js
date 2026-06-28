import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin2",
    },
    forced: true,
    filter(event, player) {
        return !event.numFixed;
    },
    async content(event, trigger, player) {
        trigger.num += game.countGroup();
    },
    group: "vl_mika_lx_discard",
    subSkill: {
        discard: {
            trigger: {
                player: "phaseDiscardBegin",
            },
            forced: true,
            async content(event, trigger, player) {
                await player.chooseToDiscard(Math.min(player.countCards('he'), game.countGroup()), 'he', true);
                trigger.cancel();
            },
            sub: true,
        },
    },
    t: {
        name: "浪息",
        info: "锁定技。摸牌阶段，你多摸X张牌；弃牌阶段，你改为弃置X张牌（X为场上存活的势力数）。",
        taici: ['灵光成线，牵动全局。', '看清了吗？胜机在此闪烁。'],
    },
};
