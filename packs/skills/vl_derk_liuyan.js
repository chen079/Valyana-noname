import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filter(event, player) {
					return player.countCards('he') > 1;
				},
    filterCard: true,
    position: "he",
    selectCard: [2, null],
    check(card) {
					if (ui.selected.cards.length > 1) return 0;
					return 4 - get.value(card);
				},
    async content(event, trigger, player) {
					var num = 0;
					for (var i = 0; i < cards.length; i++) {
						var cardnum = get.number(cards[i], player)
						num += (Math.pow((-1), i) * cardnum)
					}
					var numx = Math.abs((num % 13 == 0 ? 13 : (num % 13)));
					var card = get.cardPile2(function (card) {
						return get.number(card, false) == numx;
					});
					if (card) player.gain(card, 'gain2');
				},
    ai: {
        order: 1,
        result: {
            player: 1,
        },
    },
    t: {
        name: "流言",
        info: "出牌阶段，你可以弃置至少两张牌，然后从牌堆中获得一张点数为X的牌（X为这些牌的点数按照正负交错的方式求和并取绝对值后对13取余，若整除则视为K）。",
    },
};
