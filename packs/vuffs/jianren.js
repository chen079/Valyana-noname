import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "坚韧",
        content: "<li>你受到伤害时，伤害值-1，然后移除1层「<font color=green>坚韧</font>」。",
    },
    charlotte: true,
    trigger: {
        player: "damageBegin2"
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("jianren")
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=green>坚韧</font>」影响，本次受到的伤害值-1');
        trigger.num--;
        await player.reduceVuff("jianren");
    },
    vuffInfo: {
        naturalLose: true,
        limit: 3,
        type: 'vuff',
        vuffRank: {
            basic: [3, 0],
            add: [0.1, 0],
        },
        vuffReject: ['yishang'],
    },
};
