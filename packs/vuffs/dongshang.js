import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "冻伤",
        content: "<li>当你受到伤害时，弃置一张手牌，若此伤害为火属性，你减少1层「<font color=blue>冻伤</font>」并令此伤害+1。",
    },
    charlotte: true,
    trigger: {
        player: "damageBegin2",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("dongshang")
    },
    async content(event, trigger, player) {
        if (player.countCards('h') > 0) {
            await player.chooseToDiscard('受到「<font color=blue>冻伤</font>」影响，弃置一张手牌', 'h', true)
            game.log(player, '受到「<font color=blue>冻伤</font>」影响，弃置一张手牌')
        }
        if (trigger.nature == 'fire') {
            await player.reduceVuff('dongshang')
            trigger.num += 1
        }
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 0.8],
            add: [0, 0.2],
        },
        vuffReject: ['ranshao']
    }
};
