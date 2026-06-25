import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						var suit = ''
						if (player.getLastUsed() && player.getLastUsed().card) {
							suit = get.translation(get.suit(player.getLastUsed().card))
						}
						dialog.addText('本回合使用的上一张牌花色为：' + suit)
					},
    },
    direct: true,
    content: function () {
					'step 0'
					var evt1 = player.getLastUsed()
					var evt2 = player.getLastUsed(1)
					if (evt1 && evt1.card && evt2 && evt2.card && lib.suit.includes(get.suit(evt1.card)) && lib.suit.includes(get.suit(evt2.card))
						&& get.suit(evt1.card) == get.suit(evt2.card)) {
						player.draw();
						event.finish()
					} else {
						if (player.countCards('he') > 0) player.chooseCard('he', '重铸一张牌', true).set('ai', function (card) {
							return 100 - get.value(card)
						})
					}
					'step 1'
					if (result.bool) {
						player.recast(result.cards)
					}
				},
    _priority: 0,
    t: {
        name: "潮涌",
        info: "你使用与你本回合上一张使用牌的花色相同的牌时，摸一张牌，否则重铸一张牌。",
    },
};
