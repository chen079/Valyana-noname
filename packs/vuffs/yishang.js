import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "易伤",
        content: "<li>你受到伤害时，伤害值+1，然后移除1层「<font color=red>易伤</font>」。",
    },
    charlotte: true,
    trigger: {
        player: "damageBegin",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("yishang")
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=red>易伤</font>」影响，本次受到的伤害值+1');
        trigger.num++;
        await player.reduceVuff("yishang");
    },
    vuffInfo: {
        naturalLose: true,
        limit: 3,
        type: 'devuff',
        vuffRank: {
            basic: [0, 3],
            add: [0, 0.1],
        },
        vuffReject: ['jianren'],
    },
};
