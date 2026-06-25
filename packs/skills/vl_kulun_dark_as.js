import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        cardUsable(card, player, num) {
						if (card.name == 'sha' && get.color(card) == 'black') return Infinity;
					},
    },
    t: {
        name: "黯蚀",
        info: "锁定技，你使用黑色【杀】无次数限制。",
    },
};
