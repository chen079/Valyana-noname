import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin4",
    },
    filter(event, player) {
					return event.source != player
				},
    mod: {
        maxHandcard(player, num) {
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
    async content(event, trigger, player) {
					trigger.source.addMark('vl_nashu_sg', trigger.num)
				},
    group: "vl_nashu_sg_gain",
    subSkill: {
        gain: {
            trigger: {
                player: "phaseUseBegin",
            },
            forced: true,
            filter(event, player) {
							return game.hasPlayer(function (current) {
								return current.countMark('vl_nashu_sg') > 0
							})
						},
            async content(event, trigger, player) {
							const targets = game.filterPlayer(function (current) {
        								return current.countMark('vl_nashu_sg') > 0
        							});
							for (const target of targets) {
								const result = await target.chooseCard(Math.min(target.countCards('he'), target.countMark('vl_nashu_sg')), 'he', true).set('ai', function (card) {
        								return 100 - get.value(card)
        							}).set('prompt', '交给' + get.translation(player) + get.cnNumber(Math.min(target.countCards('he'), target.countMark('vl_nashu_sg'))) + '张牌').forResult();
								await player.gain(result.cards, target, 'giveAuto');
							}
    },
        },
    },
    t: {
        name: "蚀骨",
        info: "锁定技。①当你受到伤害时，伤害来源获得等同于此次伤害值的“蚀”标记；②你的出牌阶段开始时，拥有“蚀”的所有角色须依次交给你X张牌（X为该角色“蚀”的数量，不足则全交）；③你的手牌上限+Y（Y为拥有“蚀”标记的角色数）。",
    },
};
