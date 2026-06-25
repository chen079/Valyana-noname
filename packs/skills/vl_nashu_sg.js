import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin4",
    },
    filter: function (event, player) {
					return event.source != player
				},
    mod: {
        maxHandcard: function (player, num) {
						return num + game.countPlayer(function (current) {
							return current.countMark('vl_nashu_sg') > 0
						});
					},
    },
    marktext: "蚀",
    intro: {
        content: "你有$个“蚀”标记",
    },
    logTarget: "player",
    forced: true,
    content: function () {
					trigger.source.addMark('vl_nashu_sg', trigger.num)
				},
    group: "vl_nashu_sg_gain",
    subSkill: {
        gain: {
            trigger: {
                player: "phaseUseBegin",
            },
            forced: true,
            filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return current.countMark('vl_nashu_sg') > 0
							})
						},
            content: function () {
							'step 0'
							event.targets = game.filterPlayer(function (current) {
								return current.countMark('vl_nashu_sg') > 0
							})
							'step 1'
							event.target = event.targets.shift()
							'step 2'
							event.target.chooseCard(Math.min(event.target.countCards('he'), event.target.countMark('vl_nashu_sg')), 'he', true).set('ai', function (card) {
								return 100 - get.value(card)
							}).set('prompt', '交给' + get.translation(player) + get.cnNumber(Math.min(event.target.countCards('he'), event.target.countMark('vl_nashu_sg'))) + '张牌')
							'step 3'
							player.gain(result.cards, event.target, 'giveAuto')
							'step 4'
							if (event.targets.length) {
								event.goto(1)
							}
						},
        },
    },
    t: {
        name: "蚀骨",
        info: "锁定技。①当你受到伤害时，伤害来源获得等同于此次伤害值的“蚀”标记；②你的出牌阶段开始时，拥有“蚀”的所有角色须依次交给你X张牌（X为该角色“蚀”的数量，不足则全交）；③你的手牌上限+Y（Y为拥有“蚀”标记的角色数）。",
    },
};
