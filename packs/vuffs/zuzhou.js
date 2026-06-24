import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "诅咒",
        content: "<li>你移除此灵态时，失去X点体力。",
    },
    forced: true,
    charlotte: true,
    silent: true,
    priority: 3,
    trigger: {
        player: "reduceVuffBegin2",
    },
    filter(event, player) {
        return event.buff == 'zuzhou' && player.hasVuff('zuzhou')
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=#600030>诅咒</font>」影响');
        await player.loseHp(player.countVuffNum('zuzhou'));
    },
    vuffInfo: {
        naturalLose: false,
        limit: 5,
        type: 'devuff',
        vuffRank: {
            basic: [0, -2],
            add: [0, -2],
        },
    }
};
