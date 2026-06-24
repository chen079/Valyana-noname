import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "硬化",
        content: "<li>当你受到不小于2点伤害时，令此伤害改为1，然后移除1层「<font color=yellow>硬化</font>」。",
    },
    charlotte: true,
    trigger: {
        player: "damageBegin4",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("yinghua") && event.num >= 2
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=green>硬化</font>」影响，本次受到的伤害值改为1');
        trigger.num = 1;
        await player.reduceVuff("yinghua");
    },
    "_priority": -26,
    vuffInfo: {
        naturalLose: true,
        limit: 3,
        type: 'vuff',
        vuffRank: {
            basic: [3, 0],
            add: [0.1, 0],
        },
    },
};
