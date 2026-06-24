import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "疲惫",
        content: "<li>你的摸牌阶段额定摸牌数-1。",
    },
    forced: true,
    silent: true,
    priority: 3,
    trigger: {
        player: 'phaseDrawBefore'
    },
    filter(event, player) {
        return player.hasVuff('pibei')
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=blue>疲惫</font>」影响');
        trigger.num--;
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        limit: 5,
        vuffRank: {
            basic: [0, 1],
        },
    }
};
