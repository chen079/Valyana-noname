import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "useCardToPlayered",
	},
	linkage: "dark",
	filter(event, player) {
		return event.card.name == 'sha' && ((player.name1 == 'vl_kulun_dark') || (player.name2 == 'vl_kulun_dark'));
	},
	logTarget: "target",
	check(event, player) {
		var target = event.target;
		if (get.attitude(player, target) > 0) return false;
		return true;
	},
	async content(event, trigger, player) {
		const result = await player.chooseCard([1, 4], get.prompt2('vl_kulun_dirt_zj'), function (card) {
			var suit = get.suit(card);
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(ui.selected.cards[i]) == suit) return false;
			}
			return true;
		}).set('ai', function (card) {
			return 9 - get.value(card)
		}).set('complexCard', true).forResult()
		if (result.bool) {
			const next = player.recast(result.cards)
			var num = Math.floor(result.cards.length / 2)
			var map = trigger.customArgs;
			for (var i = 0; i < trigger.targets.length; i++) {
				var id = trigger.targets[i].playerid;
				if (!map[id]) map[id] = {};
				if (!map[id].extraDamage) map[id].extraDamage = 0;
				map[id].extraDamage += num;
			}
			await next
		}
	},
	ai: {
		threaten: 2.5,
		halfneg: true,
	},
	t: {
		name: "浊降",
		info: "浊降：连携-黑暗：当你使用【杀】指定目标后，你可以重铸任意张花色不同的牌，每重铸两张牌，此【杀】伤害+1。",
	},
};
