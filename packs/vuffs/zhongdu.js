import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "中毒",
        content: "<li>你回复体力后，移除一层「<font color=green>中毒</font>」<li>自然衰减时，失去1点体力。",
    },
    charlotte: true,
    trigger: {
        player: ["recoverAfter", "reduceVuffBegin2"],
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (!player.hasVuff('zhongdu')) return false
        if (onrewrite == 'recoverAfter') return true
        else return event.buff == 'zhongdu' && event.naturalLose == true;
    },
    async content(event, trigger, player) {
        if (trigger.name == 'recover') {
            await player.reduceVuff('zhongdu')
        } else {
            await player.loseHp()
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
