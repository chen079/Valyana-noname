import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "useCard",
	},
	filter(event, player) {
		return !event.player.hasHistory("useCard", evtx => evtx !== event);
	},
	content: async function content(event, trigger, player) {
		await trigger.player.showHandcards();
		const cards = trigger.player.getCards("h");
		if (cards.some(card => get.name(card) === get.name(trigger.card))) await trigger.player.draw();
		else {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
		}
	},
	t: {
		name: "清评",
		info: "每名角色每回合首次使用牌时，你可以展示其手牌，若其中没有同名牌则此牌无效，否则其摸一张牌。",
	},
};
