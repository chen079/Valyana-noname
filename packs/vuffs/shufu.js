import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "束缚",
        content: "<li>你使用牌只能指定与你距离小于4-X的角色为目标。",
    },
    charlotte: true,
    mod: {
        playerEnabled: function (card, player, target) {
            if (get.distance(player, target) > 4 - player.countVuffNum('shufu')) return false;
        },
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        limit: 3,
        vuffRank: {
            basic: [0, 1],
            add: [0, 0.8],
        }
    },
};
