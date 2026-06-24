import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "净化",
        content: "<li>回合开始时，移除此灵态及所有类型为减益的灵态各1层。",
    },
    charlotte: true,
    trigger: {
        player: "phaseBegin",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return get.vuffList(player, 'devuff').length > 0 && player.hasVuff('jinghua')
    },
    async content(event, trigger, player) {
        await player.reduceVuff('jinghua')
        game.log(player, '受「<font color=#FFF8D7>净化</font>」影响');
        for (let i in lib.vuff) {
            if (player.countVuffNum(i) > 0 && get.vuffInfo(i, 'type') == 'devuff') {
                await player.reduceVuff(i)
            }
        }
    },
    vuffInfo: {
        naturalLose: false,
        type: 'vuff',
        vuffRank: {
            basic: [0, 0],
        },
    }
};
