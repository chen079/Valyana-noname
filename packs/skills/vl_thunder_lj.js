import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterCard: true,
    selectCard: 1,
    usable: 1,
    filter(event, player) {
					return game.hasPlayer(current => current != player);
				},
    async content(event, trigger, player) {
        event.targets = game.filterPlayer(current => current != player)
        					event.targets.sortBySeat(player)
        					event.total = []
        					event.num = 0
        while (event.targets.length) {
        event.target = event.targets.shift()
        					const result = await event.target.chooseToRespond('请打出一张点数为' + get.number(event.cards[0]) + '或花色为' + get.translation(get.suit(event.cards[0])) + '的牌，否则' + get.translation(player) + '对你造成1点伤害。', function (card) {
        						return get.number(card) == get.number(event.cards[0]) || get.suit(card) == get.suit(event.cards[0])
        					}).set('ai', function (card) {
        						if (get.attitude(event.target, player) > 0) {
        							return 5 - get.value(card)
        						} else {
        							return 7 - get.value(card)
        						}
        					}).forResult()
        if (result.bool) {
        						event.cards = result.cards
        						event.total.push(event.cards[0])
        					} else {
        						const damageEvent = event.target.damage(player, 'thunder')
        						event.num++
        						await damageEvent
        					}
        if (event.targets.length) {
        						await game.delay()
        					}
        }
        if (event.total.length && event.num > 0) {
        					const result = await player.chooseCardButton('获得其中至多' + get.cnNumber(event.num) + '张牌', [1, event.num], event.total)
        						.set('ai', function (button) {
        							get.useful(button.link);
        						}).forResult()
        					if (result.bool) {
        						await player.gain(result.links, 'gain2')
        					}
        				}
    },
    ai: {
        order: 7,
        result: {
            player: 2,
            target: -2,
        },
    },
    group: "vl_thunder_lj_defend",
    subSkill: {
        defend: {
            lastDo: true,
            usable: 2,
            trigger: {
                source: "damageSource",
            },
            prompt2(event, player) {
							return '令' + get.translation(event.player) + '回复1点体力并摸一张牌。'
						},
            filter(event, player) {
							return event.nature == 'thunder' && event.num > 0 && event.player.isAlive()
						},
            check(event, player) {
							return get.attitude(player, event.player) > 0
						},
            async content(event, trigger, player) {
							trigger.player.recover()
							trigger.player.draw()
						},
        },
    },
    t: {
        name: "流雷",
        info: "出牌阶段限一次，你可以弃置一张手牌，令所有其他角色打出一张与上一名以此法打出或弃置的牌点数或花色相同的牌，否则你对其造成1点雷电伤害，此技能结算完毕后，你获得其他角色至多X张因此技能打出的牌（X为未打出牌的角色数）。每回合限两次，当你造成雷属性伤害后，你可以令目标角色回复1点体力并摸一张牌。",
    },
};
