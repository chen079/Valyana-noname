import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "低迷",
        content: "<li>你摸牌时，若摸牌数大于1，20X%的几率摸牌数-1。<li>你造成伤害时，15X%的几率伤害值-1。",
    },
    trigger: {
        player: "drawBegin",
        source: "damageBegin",
    },
    forced: true,
    silent: true,
    charlotte: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (!player.hasVuff('dimi')) return false;
        if (onrewrite == "drawBegin") return event.num > 1;
        return true;
    },
    async content(event, trigger, player) {
        const onrewrite = event.triggername;
        const num = player.countVuffNum('dimi');
        if (onrewrite == "drawBegin") {
            if (Math.random() <= num * 0.2) {
                game.log(player, '受「<font color=blue>低迷</font>」影响，本次摸牌数-1');
                trigger.num--;
            }
        }
        if (onrewrite == "damageBegin") {
            if (Math.random() <= num * 0.15) {
                game.log(player, '受「<font color=blue>低迷</font>」影响，本次造成的伤害值-1');
                trigger.num--;
            }
        }
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            random: [0, 0.25],
            randomPower: 1.5,
        },
        type: 'devuff',
        limit: 5,
        vuffReject: ["guwu"]
    },
};
