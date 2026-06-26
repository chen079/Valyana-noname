import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const getUseCardHistoryEvent = (player, offset = 0) => {
	const history = player.getAllHistory ? player.getAllHistory("useCard") : player.getHistory("useCard");
	return history && history.length > offset ? history[history.length - 1 - offset] : null;
};

export default {
	locked: false,
	mod: {
		cardUsable(card, player) {
			let color1 = get.color(card), evt = getUseCardHistoryEvent(player, 0);
			if (evt && evt.card && color1 == get.color(evt.card)) return Infinity;
		},
		aiOrder(player, card, num) {
			if (typeof card == 'object' && player.isPhaseUsing()) {
				let evt = getUseCardHistoryEvent(player, 1);
				let evtb = getUseCardHistoryEvent(player, 2)
				if (evt && evt.card && evtb && evtb.card && (evtb.card.number && evt.card.number && ((get.number(evt.card, false) + get.number(evtb.card, false)) % 13) == get.number(card))) {
					return num + 10;
				}
				let cards = player.getCards('hs').remove(card)
				let cardlist = []
				for (let i = 0; i < cards.length; i++) {
					cardlist.push(get.number(cards[i]))
				}
				if (evt && evt.card) {
					let value2 = (get.number(card) + get.number(evt.card)) % 13
					value2 = value2 == 0 ? 13 : value2
					if (cardlist.includes(value2)) return num + 3
				}
			}
		},
	},
	trigger: {
		player: "useCard",
	},
	mark: true,
	intro: {
		markcount(storage, player) {
			let evt = getUseCardHistoryEvent(player, 0);
			let evt1 = getUseCardHistoryEvent(player, 1);
			if (evt && evt1 && evt.card && evt1.card) {
				let value = (get.number(evt.card, false) + get.number(evt1.card, false)) % 13
				value = value == 0 ? 13 : value
				return get.strNumber(value)
			}
			return
		},
		mark(dialog, storage, player, skill) {
			let evt = getUseCardHistoryEvent(player, 0);
			let evt1 = getUseCardHistoryEvent(player, 1);
			if (evt && evt.card) {
				dialog.addText('你上一张使用牌的点数为' + get.number(evt.card))
				dialog.addText('你使用' + get.translation(get.color(evt.card)) + '的牌无次数限制')
			}
			if (evt && evt.card && evt1 && evt1.card) {
				let value = (get.number(evt.card, false) + get.number(evt1.card, false)) % 13
				value = value == 0 ? 13 : value
				dialog.addText('当你使用点数为' + get.strNumber(value) + '的牌时，你摸两张牌')
			}
		},
	},
	frequent: true,
	filter(event, player) {
		let evt = getUseCardHistoryEvent(player, 1);
		if (!evt || !evt.card) return false;
		if (!player.isPhaseUsing()) return false;
		let evtb = getUseCardHistoryEvent(player, 2);
		if (!evtb || !evtb.card) return false;
		let value = (get.number(evt.card, false) + get.number(evtb.card, false)) % 13
		value = value == 0 ? 13 : value
		return typeof get.number(evt.card, false) == 'number' && typeof get.number(evtb.card, false) == 'number' && (value == get.number(event.card));
	},
	async content(event, trigger, player) {
		await player.draw(2);
	},
	t: {
		name: "连语",
		info: "当你使用牌时，若此牌的点数与你使用的前两张牌的点数和对13取余（若整除则视为K）相等，你摸两张牌；锁定技，你使用与你上一张使用牌的颜色相同的牌无次数限制。",
	},
};
