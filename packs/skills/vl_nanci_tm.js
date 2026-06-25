import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterTarget(card, player, target) {
		return target != player;
	},
	content: async function content(event, trigger, player) {
		const target = event.targets[0];
		const card1 = get.cardPile2(function (card) {
			return get.name(card, false) == 'shan';
		});
		if (card1) { await target.gain(card1, 'gain2') }
		else { player.say("闪呢？") }
		await target.chooseToDiscard(2, 'he', true)
	},
	ai: {
		order: 7,
		result: {
			target(player, target) {
				if (target.countCards('he') == 1) return -2
				if (target.countCards('he') == 2) return -1
				if (target.countCards('he') >= 3 && target.countCards('hs', 'shan') == 0) return 0.5
				if (target == player) return 1
				return -1
			},
		},
		threaten: 1,
	},
	t: {
		name: "天蔑",
		info: "出牌阶段限一次，你可以令一名其他角色获得一张【闪】并弃置两张牌。",
	},
};
