import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "迷茫",
        content: "<li>你不能使用或打出实体的【杀】和【无懈可击】。",
    },
    charlotte: true,
    mod: {
        cardEnabled2: function (card, player) {
            if (player.countVuffNum("mimang") > 0) {
                if (card.name == 'sha' || card.name == 'wuxie') return false;
            }
        },
    },
    vuffInfo: {
        naturalLose: true,
        limit: 3,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1.5],
            add: [0, 0.1],
        }
    },
};
