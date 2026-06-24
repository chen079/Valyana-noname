import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "盈能",
        content: "<li>当你消耗灵能时，移除Y层盈能，然后减少等量灵能消耗（Y为你此次消耗的灵能值）。",
    },
    trigger: {
        player: "consumeVpBegin1",
    },
    charlotte: true,
    forced: true,
    silent: true,
    priority: 3,
    async content(event, trigger, player) {
        const num = Math.min(player.countVuffNum('yingneng'), trigger.num)
        trigger.num -= num
        await player.reduceVuff('yingneng', num)
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [0.5, 0],
            randomPower: 0.2
        },
        type: 'vuff',
    },
};
