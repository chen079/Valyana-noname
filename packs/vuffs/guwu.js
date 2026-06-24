import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "鼓舞",
        content: "<li>你摸牌时，20X%的几率摸牌数+1。<li>你造成伤害时，15X%的几率伤害值+1。",
    },
    trigger: {
        player: "drawBegin",
        source: "damageBegin",
    },
    forced: true,
    silent: true,
    charlotte: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('guwu')
    },
    async content(event, trigger, player) {
        const onrewrite = event.triggername;
        const num = player.countVuffNum('guwu');
        if (onrewrite == "drawBegin") {
            if (Math.random() <= num * 0.2) {
                game.log(player, '受「<font color=yellow>鼓舞</font>」影响，本次摸牌数+1');
                trigger.num++;
            }
        }
        if (onrewrite == "damageBegin") {
            if (Math.random() <= num * 0.15) {
                game.log(player, '受「<font color=yellow>鼓舞</font>」影响，本次造成的伤害值+1');
                trigger.num++;
            }
        }
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            random: [0.25, 0],
            randomPower: 1.5,
        },
        type: 'vuff',
        limit: 5,
        vuffReject: ["dimi"],
    }
};
