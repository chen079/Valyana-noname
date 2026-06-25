import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    filter: function (event, player) {
					if (['equip', 'delay'].includes(get.type(event.card))) return false;
					var cards = player.getCards('h')
					return cards.length && cards.filter(i => get.color(i) == 'red').length == cards.length || cards.filter(i => get.color(i) == 'black').length == cards.length
				},
    content: () => {
					'step 0'
					player.showHandcards();
					var choice = ['摸牌'], choiceList = ['摸一张牌，获得当前回合角色或一名目标角色的一张牌']
					if (player.countCards('he') > 0) {
						choice.push('额外结算')
						choiceList.push('弃置一张牌，令此牌额外结算一次')
					}
					player.chooseControl(choice).set('choiceList', choiceList).set('ai', function () {
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
					})
					'step 1'
					if (result.control == '摸牌') {
						player.draw()
						var targets = trigger.targets.slice(0)
						targets.add(_status.currentPhase)
						targets = targets.filter(target => target != player && target.countCards('he') > 0)
						if (targets.length) {
							player.chooseTarget('当前回合角色或目标角色的一张牌', function (card, player, target) {
								return targets.includes(target)
							}).set('ai', function (target) {
								return -get.attitude(player, target)
							})
						} else {
							event.finish()
						}
					} else {
						player.chooseToDiscard(1, 'he', true)
						trigger.effectCount++;
						game.log(trigger.card, '额外结算一次');
						event.finish()
					}
					'step 2'
					if (result.bool) {
						var target = result.targets[0]
						player.gainPlayerCard(target, 'he', true)
					}
				},
    t: {
        name: "倾势",
        info: "你使用「jishi」时，若你的手牌颜色只有一种，你可以展示手牌然后选择一项：<li>1.摸一张牌，然后可以获得当前回合角色或一名目标角色的一张牌；<li>2.弃置一张牌，令此牌额外结算一次。",
    },
};
