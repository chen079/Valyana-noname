import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	forced: true,
	trigger: {
		global: "phaseDrawAfter",
	},
	filter(event, player) {
		return event.player.isAlive() && event.player != player;
	},
	async content(event, trigger, player) {
		var next = player.chooseControl("选项一", "选项二", true).set("prompt", "请选择发动的选项：").set('choiceList', ['观看并获得当前角色一张牌', '获得牌堆中的一张杀'])
		next.ai = function (event, player) {
			if (get.attitude(player, event.player) < 0) {
				return 0
			} else return 1
		}
		const result = await next.forResult()
		if (result.index == 0) { await player.gainPlayerCard(1, 'he', trigger.player, true, 'visible') }
		if (result.index == 1) {
			var card = get.cardPile2(function (card) { return card.name == 'sha'; });
			if (card) await player.gain(card, 'gain2');
		}
		return
	},
	t: {
		name: "强掳",
		info: "锁定技，其他角色摸牌阶段结束后，你选择一项：1.观看并获得该角色的一张牌；2.获得牌堆中的一张【杀】。",
	},
};
