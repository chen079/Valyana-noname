import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "出血",
        content: "<li>当你的「<font color=red>出血</font>」层数大于你的体力值时，你移除所有出血层数，然后流失X/2点体力（向下取整且至少为1）",
    },
    charlotte: true,
    trigger: {
        player: ["addVuffAfter", 'changeHp', "reduceVuffAfter"],
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (!player.hasVuff('ohuxue')) return false
        return player.countVuffNum('ohuxue') > player.hp
    },
    async content(event, trigger, player) {
        const num = player.countVuffNum('ohuxue')
        player.olearVuff('ohuxue')
        await player.loseHp(Math.max(1, Math.floor(num / 2)))
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 0.9],
            add: [0, 1],
        },
    }
};
