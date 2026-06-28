import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "damageBefore",
	},
	popup: false,
	filter(event, player) {
		return event.source && event.source != player && event.player != player && event.player != event.source && event.player.countCards('h') > 0
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0 && player.hp > 1
	},
	async content(event, trigger, player) {
		const target = trigger.player;
		const result = await trigger.player.chooseCard(Math.max(1, Math.floor(trigger.player.countCards('h') / 2)), 'h')
			.set('prompt', '###是否对' + get.translation(trigger.source) + '发动【讨雠】？###交给' + get.translation(player) + get.cnNumber(Math.max(1, Math.floor(trigger.player.countCards('h') / 2))) + '张手牌，然后将此伤害转移给' + get.translation(player) + '并令其摸' + get.cnNumber(player.getDamagedHp() + 1) + '张牌')
			.set('ai', function (card) {
				const player = _status.event.player;
				const target = _status.event.target;
				const att = get.attitude(player, target)
				if (trigger.num > 1 || (player.hp == 1 && player.countCards('hs', 'tao') == 0)) {
					return 9 - get.value(card)
				}
				if (att > 0 && player.countCards('hs', 'tao') == 0) {
					return 9 - get.value(card)
				} else if (att > 0 && player.countCards('hs', 'tao') > 0) {
					return 7 - get.value(card)
				} else {
					return 4 - get.value(card)
				}
			}).set('target', player)
			.forResult();
		if (result.bool) {
			await trigger.player.give(result.cards, player)
			trigger.player = player
			await player.draw(player.getDamagedHp() + 1)

		}
	},
	t: {
		name: "讨雠",
		info: "一名其他角色受到另一名其他角色的伤害前，你可以令该角色选择是否交给你X张牌（X为其手牌数的一半并向下取整且至少为1），然后将此伤害转移给你并令你摸Y+1张牌（Y为你的已损失体力值）。",
        taici: ['敢犯我者，骨裂声便是回响。', '米兰的钟声，今日为你而鸣。'],
    },
};
