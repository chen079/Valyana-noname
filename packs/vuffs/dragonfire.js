import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "龙焰",
        content: "<li>当你获得「龙焰」时，你击碎1个勾玉。<li>自然衰减时，你受到1点火焰伤害。",
    },
    charlotte: true,
    trigger: {
        player: ["addVuffBegin1", "reduceVuffBegin2"],
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (onrewrite == "addVuffBegin1") {
            return event.buff == 'dragonfire'
        } else {
            return player.hasVuff('dragonfire') && event.naturalLose && event.buff == 'dragonfire'
        }
    },
    async content(event, trigger, player) {
        const onrewrite = event.triggername
        if (onrewrite == "addVuffBegin1") {
            await player.brokenHp()
            event.finish()
            return;
        } else {
            game.log(player, '受「<font color=blaok>龙焰</font>」影响');
            await player.damage(1, 'fire', 'nosource')
        }
    },
    vuffInfo: {
        naturalLose: true,
        limit: 3,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1],
            add: [0, 0.1],
        }
    },
};
