import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "失声",
        content: "<li>你的拼点牌点数-X。",
    },
    charlotte: true,
    trigger: {
        player: "compare",
        target: "compare",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        if (event.player == player) return !event.iwhile;
        return player.hasVuff('shisheng')
    },
    async content(event, trigger, player) {
        const num = player.countVuffNum('shisheng');
        if (player == trigger.player) {
            trigger.num1 -= num;
            if (trigger.num1 < 1) trigger.num1 = 1;
        }
        else {
            trigger.num2 -= num;
            if (trigger.num2 < 1) trigger.num2 = 1;
        }
        game.log(player, '的拼点牌点数-' + num);
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 0.3],
            add: [0, 0.4],
        }
    },
};
