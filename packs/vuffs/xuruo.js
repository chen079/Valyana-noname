import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "虚弱",
        content: "<li>当你造成伤害时，此伤害-X，并移除1层「虚弱」<li>你的回合结束后，你移除所有「虚弱」。",
    },
    charlotte: true,
    trigger: {
        source: "damageBegin2",
        player: 'phaseAfter'
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('xuruo')
    },
    async content(event, trigger, player) {
        if (event.triggername == 'damageBegin2') {
            trigger.num -= player.countVuffNum('xuruo')
            await player.reduceVuff('xuruo')
        } else {
            await player.clearVuff('xuruo')
        }
    },
    vuffInfo: {
        naturalLose: false,
        type: 'devuff',
        vuffRank: {
            basic: [0, 2],
            add: [0, 0.8],
        }
    },
};
