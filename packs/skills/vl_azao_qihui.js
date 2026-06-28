import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	getUsedHuCards(player, event) {
		const cards = [];
		player.getHistory('lose', function (evt) {
			if (evt.getParent() != event) return false;
			if (!evt.gaintag_map) return false;
			for (const id in evt.gaintag_map) {
				if (!evt.gaintag_map[id].includes('vl_azao_huxi_hand')) continue;
				const list = event.cards.filter(card => get.position(card, true) == 'o' && card.cardid == id);
				if (list.length) cards.addArray(list);
			}
		});
		return cards;
	},
	trigger: {
		player: "useCard",
	},
	forced: true,
	filter(event, player) {
		return event.cards && lib.skill.vl_azao_qihui.getUsedHuCards(player, event).length > 0;
	},
	async content(event, trigger, player) {
		const cards = lib.skill.vl_azao_qihui.getUsedHuCards(player, trigger);
		if (!cards.length) return;
		if (get.color(cards[0]) == 'red') {
			trigger.addCount = false;
			const stat = player.getStat().card, name = trigger.card.name;
			if (typeof stat[name] == 'number') stat[name]--;
			await player.draw(2);
		} else if (get.color(cards[0]) == 'black') {
			trigger.directHit.addArray(game.players);
		}
	},
	mod: {
		ignoredHandcard(card, player) {
			if (card.hasGaintag && card.hasGaintag('vl_azao_huxi_hand')) return true;
		},
		cardUsable(card, player, num) {
			if (card.hasGaintag && card.hasGaintag('vl_azao_huxi_hand') && get.color(card) == 'red') return Infinity;
		},
	},
	t: {
		name: "契辉",
		info: "你的“护”不计入手牌上限。你使用“护”时，若此牌为红色：你摸两张牌且不计入次数限制。若为黑色：此牌不可被响应。",
	},
};
