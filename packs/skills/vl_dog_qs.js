import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "useCard",
	},
	filter(event, player) {
		if (['equip', 'delay'].includes(get.type(event.card))) return false;
		let cards = player.getCards('h')
		return cards.length && cards.filter(i => get.color(i) == 'red').length == cards.length || cards.filter(i => get.color(i) == 'black').length == cards.length
	},
	async content(event, trigger, player) {
		await player.showHandcards();
		let choice = ['摸牌'], choiceList = ['摸一张牌，获得当前回合角色或一名目标角色的一张牌']
		if (player.countCards('he') > 0) {
			choice.push('额外结算')
			choiceList.push('弃置一张牌，令此牌额外结算一次')
		}
		const result = await player.chooseControl(choice).set('choiceList', choiceList).set('ai', function () {
			if (_status.currentPhase != player) {
				return '摸牌'
			} else if (player.countCards('he') > player.maxHp ||
				(trigger.player.hp <= 2 && get.tag(trigger.card, 'damage') > 0 && get.attitude(player, target) < 0 && choice.includes('额外结算'))) {
				return '额外结算'
			} else if (get.name(trigger.card) == 'wuzhong' && choice.includes('额外结算')) {
				return '额外结算'
			} else if (get.name(trigger.card) == 'tao' && player.hp < player.maxHp - 1 && choice.includes('额外结算')) {
				return '额外结算'
			} else return '摸牌'
		}).forResult();
		if (result.control == '摸牌') {
			await player.draw()
			let targets = trigger.targets.slice(0)
			targets.add(_status.currentPhase)
			targets = targets.filter(target => target != player && target.countCards('he') > 0)
			if (targets.length) {
				const targetResult = await player.chooseTarget('当前回合角色或目标角色的一张牌', function (card, player, target) {
					return targets.includes(target)
				}).set('ai', function (target) {
					return -get.attitude(player, target)
				}).forResult();
				if (targetResult.bool) {
					let target = targetResult.targets[0]
					await player.gainPlayerCard(target, 'he', true)
				}
			} else {
				return
			}
		} else {
			await player.chooseToDiscard(1, 'he', true)
			trigger.effectCount++;
			game.log(trigger.card, '额外结算一次');
			return
		}
	},
	t: {
		name: "倾势",
		info: `你使用${get.poptip("jishi")}时，若你的手牌颜色只有一种，你可以展示手牌然后选择一项：<li>1.摸一张牌，然后可以获得当前回合角色或一名目标角色的一张牌；<li>2.弃置一张牌，令此牌额外结算一次。`,
	},
};
