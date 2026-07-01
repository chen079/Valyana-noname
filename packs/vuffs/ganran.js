import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "感染",
        content: "<li>标记，不会自然衰减。",
    },
    charlotte: true,
    vuffInfo: {
        naturalLose: false,
        type: 'devuff',
        vuffRank: {
            basic: [0, 0.5],
            add: [0, 0.5],
        },
        vuffReject: ['bingyuan'],
    },
};
