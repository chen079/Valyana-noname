import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const getUseCardHistoryEvent = (player, offset = 0) => {
	const history = player.getAllHistory ? player.getAllHistory("useCard") : player.getHistory("useCard");
	return history && history.length > offset ? history[history.length - 1 - offset] : null;
};

export default {
	trigger: {
		player: "useCard",
	},
	mark: true,
	intro: {
		mark(dialog, storage, player) {
			var suit = ''
			if (getUseCardHistoryEvent(player, 0) && getUseCardHistoryEvent(player, 0).card) {
				suit = get.translation(get.suit(getUseCardHistoryEvent(player, 0).card))
			}
			dialog.addText('本回合使用的上一张牌花色为：' + suit)
		},
	},
	direct: true,
	async content(event, trigger, player) {
		var evt1 = getUseCardHistoryEvent(player, 0)
		var evt2 = getUseCardHistoryEvent(player, 1)
		if (evt1 && evt1.card && evt2 && evt2.card && lib.suit.includes(get.suit(evt1.card)) && lib.suit.includes(get.suit(evt2.card))
			&& get.suit(evt1.card) == get.suit(evt2.card)) {
			await player.draw();
			return
		} else {
			if (player.countCards('he') > 0) {
				const result = await player.chooseCard('he', '重铸一张牌', true).set('ai', function (card) {
					return 100 - get.value(card)
				}).forResult()
				if (result.bool) {
					await player.recast(result.cards)
				}
			}
		}
	},
	_priority: 0,
	t: {
		name: "潮涌",
		info: "你使用与你本回合上一张使用牌的花色相同的牌时，摸一张牌，否则重铸一张牌。",
	},
};
