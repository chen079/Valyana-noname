import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    linkage: "dirt",
    locked: false,
    trigger: {
        player: "useCard",
    },
    frequent: true,
    filter: function (event, player) {
					return (get.type(event.card, 'trick') == 'trick' && event.card.isCard) && ((player.name1 == 'vl_kulun_dirt') || (player.name2 == 'vl_kulun_dirt'));;
				},
    content: function () {
					'step 0'
					player.draw();
				},
    ai: {
        threaten: 1.4,
        noautowuxie: true,
    },
    _priority: 0,
    t: {
        name: "淬灭",
        info: "连携-大地：当你使用锦囊牌后，你可以摸一张牌。",
    },
};
