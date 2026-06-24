import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "混乱",
        content: "<li>你的行为不受控制。",
    },
    charlotte: true,
    vuffInfo: {
        naturalLose: true,
        limit: 2,
        type: 'devuff',
        vuffRank: {
            naturalLose: true,
            basic: [0, 1],
            random: [0.1, 0.9],
            randomPower: 3,
        },
    }
};
