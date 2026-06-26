import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	forced: true,
	trigger: {
		player: "phaseJieshuBegin",
	},
	init(player) {
		if (!player.storage.vl_nanci_tq) player.storage.vl_nanci_tq = []
	},
	async content(event, trigger, player) {
		let list = [];
		game.getGlobalHistory('cardMove', function (evt) {
			if (evt.name == 'lose') {
				if (evt.position == ui.discardPile) {
					for (let i of evt.cards) {
						if (get.color(i) == 'red') list.add(i);
					}
				}
			}
			else {
				if (evt.name == 'cardsDiscard') {
					for (let i of evt.cards) {
						if (get.color(i) == 'red') list.add(i);
					}
				}
			}
		});
		list = list.filterInD('d')
		let cards = list.slice(0, 2)
		if (!cards.length) return;
		player.gain(cards, 'gain2')
		player.storage.vl_nanci_tq = cards
	},
	t: {
		name: "天祈",
		info: "锁定技，结束阶段，你获得本回合进入弃牌堆的前两张红色牌。",
	},
};
