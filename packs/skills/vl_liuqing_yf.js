import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterTarget: lib.filter.notMe,
	selectTarget() {
		return [1, _status.event.player.countCards("he")];
	},
	multitarget: true,
	content: async function content(event, trigger, player) {
		const gainCards = [];
		for (const target of event.targets) {
			await player.chooseToGive(target, "he", true);
			if (!target.countCards("he", { type: "equip" })) await target.showHandcards();
			else {
				const { cards } = await target.chooseCard("he", (card, player, target) => get.type(card, player) === "equip", true).forResult();
				await target.$throw(cards.length);
				gainCards.addArray(cards);
			}
		}
		if (gainCards.length) await player.gain(gainCards);
	},
	t: {
		name: "易服",
		info: "出牌阶段限一次，你可以交给任意名其他角色各一张牌，这些角色须交给你一张装备（若没有须展示所有手牌）。",
	},
};
