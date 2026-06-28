import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseJieshuBegin",
	},
	forced: true,
	filter(event, player) {
		return player.getStorage('vl_edmond_jz', [[], []])[0].length > 0;//=Math.max(1,player.getDamagedHp());
	},
	async content(event, trigger, player) {
		const result = await player.chooseControl("选项一", "选项二", true)
			.set("choiceList", ["摸两张牌，并令原使用者依次对你使用所有的“战”，然后获得无法使用的“战”", "失去1点体力，并对所有原使用者依次使用所有的“战”，然后弃置无法使用的“战”"])
			.forResult();
		const list = player.getStorage('vl_edmond_jz', [[], []]);
		if (result.index == 0) {
			await player.draw(2);
			while (list[0].length) {
				const card = list[0].shift(), source = list[1].shift();
				if (!player.getExpansions('vl_edmond_jz').includes(card)) continue;
				if (source && source.isIn() && source.canUse(card, player, false)) await source.useCard(card, player, false);
				else await player.gain(card);
			}
		} else {
			await player.loseHp();
			while (list[0].length) {
				const card = list[0].shift(), source = list[1].shift();
				if (!player.getExpansions('vl_edmond_jz').includes(card)) continue;
				if (source && source.isIn() && player.canUse(card, source, false)) await player.useCard(card, source, false);
				else await player.loseToDiscardpile(card);
			}
		}
	},
	t: {
		name: "护幼",
		info: "锁定技，结束阶段，若你有“战”，则你选择一项：①摸两张牌，并令原使用者依次对你使用所有的“战”，然后获得无法使用的“战”；②失去1点体力，并对所有原使用者依次使用所有的“战”，然后弃置无法使用的“战”。",
	},
};
