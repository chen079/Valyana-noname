import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin1",
    },
    forced: true,
    async content(event, trigger, player) {
        if (player.isMinHandcard()) {
            trigger.num += 2
        } else {
            trigger.num += 1
        }
    },
    t: {
        name: "窃隐",
        info: "锁定技，摸牌阶段开始时，若你的手牌数为全场最少之一，本阶段多摸两张牌，否则你多摸一张牌。",
        taici: ['羁绊成锁，也成锋芒。', '同心一刻，足以逆天。'],
    },
};
