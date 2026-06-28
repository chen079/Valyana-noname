import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "chooseToUse",
	filter(event, player) {
		if (player.countCards("h") === 0 || player.countCards("he") <= 1) return false;
		const list = player.getStorage("vl_qiushou_yl");
		for (const card of player.getCards("h")) {
			if (get.type(card) === "equip" || get.type(card) === "delay" || list.includes(get.name(card))) continue;
			if (event.filterCard(get.autoViewAs({ name: get.name(card), nature: get.nature(card) }, "unsure"), player, event)) return true;
		}
		return false;
	},
	chooseButton: {
		dialog(event, player) {
			const cards = [];
			const list = player.getStorage("vl_qiushou_yl");
			for (const card of player.getCards("h")) {
				if (get.type(card) === "equip" || get.type(card) === "delay" || list.includes(get.name(card))) continue;
				if (event.filterCard(get.autoViewAs({ name: get.name(card), nature: get.nature(card) }, "unsure"), player, event)) cards.push(card);
			}
			return ui.create.dialog("刈论", [cards, "card"], "hidden");
		},
		backup(links, player) {
			return {
				check: function (card) {
					return 1 / Math.max(0.1, get.value(card));
				},
				filterCard: function (card) {
					return card !== links[0];
				},
				viewAs: {
					name: get.name(links[0]),
					nature: get.nature(links[0]),
				},
				position: "he",
				popname: true,
				ignoreMod: true,
				onuse(result, player) {
					if (!player.getStorage('vl_liuqing_yf', false)) {
						player.when({ global: "phaseAfter" }).then(() => {
							player.unmarkSkill("vl_qiushou_yl");
						});
					}
					player.markAuto("vl_qiushou_yl", get.name(links[0]));
				},
			};
		},
		prompt(links, player) {
			return "将一张牌当作" + get.translation(links[0]) + "使用";
		},
	},
	marktext: "论",
	intro: {
		content: "本回合已因〖刈论〗使用过$",
		onunmark: true,
	},
	t: {
		name: "刈论",
		info: "你可以展示一张基本或普通锦囊牌，然后将一张牌当做此牌的同名牌使用，每种牌名每回合限一次。",
	},
};
