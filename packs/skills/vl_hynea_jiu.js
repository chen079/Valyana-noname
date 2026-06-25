import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    mod: {
        cardname(card, player) {
            if (card.name == 'tao' || card.name == 'shan') return 'jiu';
        },
    },
    t: {
        name: "vl_hynea_jiu",
        info: "",
    },
};
