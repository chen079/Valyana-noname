import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		source: "damageSource",
	},
	filter(event, player) {
		return event.player != player && event.player.isIn() && event.player.countCards('he') > 0
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0
	},
	async content(event, trigger, player) {
		const result = await trigger.player.chooseCard('he', '是否对' + get.translation(player) + '发动【复苏】？', '交给' + get.translation(player) + '一张牌并回复1点体力').set('ai', function (card) {
			var player = _status.event.player
			if (player.hp <= 2) {
				return 9 - get.value(card)
			} else if (player.hp == player.maxHp) {
				return 0
			} else {
				return 5 - get.value(card)
			}
		}).forResult();
		if (result.bool) {
			await trigger.player.recover();
			await trigger.player.give(result.cards, player);
		}
	},
	t: {
		name: "复苏",
		info: "当你对其他角色造成伤害后，你可以令其选择是否：交给你一张牌并回复1点体力。",
	},
};
