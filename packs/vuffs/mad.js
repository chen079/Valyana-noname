import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "疯狂",
        content: "<li>自然衰减时，你随机弃置一张牌",
    },
    charlotte: true,
    trigger: {
        player: "reduceVuffBegin2",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('mad') && event.naturalLose && event.buff == 'mad'
    },
    async content(event, trigger, player) {
        await player.randomDiscard(1, 'he', true);
    },
    vuffInfo: {
        naturalLose: true,
        limit: 5,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1],
            add: [0, 0.1],
        }
    },
};
