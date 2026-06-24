import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "压制",
        content: "<li>你的攻击范围-X。",
    },
    charlotte: true,
    mod: {
        attackRange: function (player, range) {
            if (player.hasVuff('yazhi')) return range - player.countVuffNum('yazhi');
        },
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1],
            add: [0, 0.5],
        },
    }
};
