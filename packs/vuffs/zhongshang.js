import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "重伤",
        content: "<li>你回复体力时，移除一层「<font color=green>重伤</font>」并令此次回复量-1。",
    },
    charlotte: true,
    trigger: {
        player: ["recoverBegin"],
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('zhongshang')
    },
    async content(event, trigger, player) {
        if (trigger.name == 'recover') {
            game.log(player, '受「<font color=green>重伤</font>」影响，本次回复量-1。');
            await player.reduceVuff('zhongshang')
            trigger.num--
        }
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 2],
        },
    }
};
