import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "回生",
        content: "<li>当你进入濒死状态时，移除一层「<font color=green>回生</font>」并将体力恢复至1点。",
    },
    charlotte: true,
    trigger: {
        player: "dying",
    },
    forceDie: true,
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('huisheng')
    },

    async content(event, trigger, player) {
        await player.reduceVuff('huisheng')
        await player.recover(1 - player.hp);
    },
    ai: {
        save: true,
        skillTagFilter(player, tag, target) {
            return player == target;
        },
        threaten: 0.6
    },
    vuffInfo: {
        naturalLose: true,
        limit: 1,
        type: 'vuff',
        vuffRank: {
            basic: [4, 0],
        },
    },
};
