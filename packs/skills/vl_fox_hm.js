import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "useCardAfter",
	},
	forced: true,
	filter(event, player) {
		if (!event.targets.length) return false
		return event.card.isCard && (get.type(event.card) == 'trick' || get.type(event.card) == 'basic') &&
			get.position(event.cards[0], true) == 'o' && event.card.name == event.cards[0].name && event.getParent().name != 'vl_fox_hm_1'
	},
	intro: {
		markcount(storage) {
			if (!storage) return 0;
			return storage[0].length;
		},
		mark(dialog, storage, player) {
			if (!storage) return;
			dialog.addAuto(storage[0]);
			dialog.addText(get.translation(storage[1]));
		},
		onunmark(storage, player) {
			player.setStorage('vl_fox_hm', [[], []]);
		},
	},
	onremove(player, skill) {
		let cards = player.getExpansions(skill);
		if (cards.length) player.loseToDiscardpile(cards);
		player.setStorage(skill, [[], []]);
	},
	async content(event, trigger, player) {
		let card = trigger.cards[0];
		if (!player.hasStorage('vl_fox_hm')) player.setStorage('vl_fox_hm', [[], []]);
		player.addToExpansion(card, 'gain2').gaintag.add('vl_fox_hm');
		player.getStorage('vl_fox_hm', [[], []])[0].push(card);
		player.getStorage('vl_fox_hm', [[], []])[1].push(trigger.targets);
		game.delayx();
	},
	group: "vl_fox_hm_1",
	subSkill: {
		"1": {
			trigger: {
				player: "phaseJieshuBegin",
			},
			forced: true,
			filter(event, player) {
				return player.hasStorage('vl_fox_hm') && player.getStorage('vl_fox_hm', [[], []])[0].length > 0;
			},
			async content(event, trigger, player) {
				let list = player.getStorage('vl_fox_hm', [[], []]);
				while (list[0].length) {
					let card = list[0].shift(), source = list[1].shift();
					if (player.getExpansions('vl_fox_hm').includes(card)) {
						for (let i = 0; i < source.length; i++) {
							if (!source[i].isIn() || !player.canUse(card, source[i], false)) {
								source.remove(source[i])
							}
						}
						if (source.length != 0) await player.useCard(card, source, false);
						else await player.loseToDiscardpile(card);
					}
				}
			},
			sub: true,
		},
	},
	t: {
		name: "幻梦",
		info: "锁定技，当你不因〖幻梦〗使用有目标的基本牌或普通锦囊牌结算完毕后，若此牌非转化且对应的实体牌数为1，你将此牌置于你的武将牌上，称为“幻”；结束阶段，若你有“幻”，你依次对所有“幻”的原目标使用这些“幻”，并弃置无法使用的“幻”。",
	},
};
