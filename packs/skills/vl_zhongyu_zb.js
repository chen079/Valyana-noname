import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: ["phaseDrawBegin", "phaseUseBegin", "phaseDiscardBegin"],
		source: ["damageBegin"],
	},
	filter(event, player) {
		return game.hasPlayer(function (current) {
			return current.countVuffNum('chuxue') > 0
		})
	},
	direct: true,
	async content(event, trigger, player) {
		const num = game.countPlayer(function (current) {
			return current.countVuffNum('chuxue') > 0
		})
		let str = '移去任意名角色的『出血』，'
		if (trigger.name == 'phaseDraw') {
			str += '摸牌阶段多摸等量的牌'
		} else if (trigger.name == 'phaseUse') {
			str += '出牌阶段多出等量的杀'
		} else if (trigger.name == 'phaseDiscard') {
			str += '弃牌阶段你增加等量的手牌上限'
		} else {
			str += '令此次对' + get.translation(trigger.player) + '增加等量的伤害'
		}
		const result = await player.chooseTarget([1, num], false).set('ai', function (target) {
			const player = _status.event.player
			return (get.attitude(player, target) - 2 * Math.random() + 1)
		}).set('filterTarget', function (card, player, target) {
			return target.countVuffNum('chuxue') > 0
		}).set('prompt2', str).forResult()
		if (result.bool) {
			let removed = 0
			for (let i = 0; i < result.targets.length; i++) {
				removed += result.targets[i].countVuffNum('chuxue')
				result.targets[i].clearVuff('chuxue')
			}
			if (trigger.name == 'phaseDraw') {
				trigger.num += removed
				game.log(player, '摸牌阶段的摸牌数+' + removed);
			} else if (trigger.name == 'phaseUse') {
				player.setStorage('vl_zhongyu_zb_effect_sha', removed);
				player.addTempSkill('vl_zhongyu_zb_effect')
				game.log(player, '出牌阶段使用【杀】的次数上限+' + removed);
			} else if (trigger.name == 'phaseDiscard') {
				player.setStorage('vl_zhongyu_zb_effect_limit', removed);
				player.addTempSkill('vl_zhongyu_zb_effect')
				game.log(player, '的手牌上限+' + removed)
			} else {
				trigger.num += removed
			}
		}
	},
	subSkill: {
		effect: {
			charlotte: true,
			onremove(player) {
				player.setStorage('vl_zhongyu_zb_effect_limit', 0)
				player.setStorage('vl_zhongyu_zb_effect_sha', 0)
			},
			mod: {
				cardUsable(card, player, num) {
					if (card.name == 'sha') {
						return num += player.getStorage('vl_zhongyu_zb_effect_sha', 0)
					}
				},
				maxHandcardBase(player, num) {
					return num += player.getStorage('vl_zhongyu_zb_effect_limit', 0)
				},
			},
			sub: true,
		},
	},
	t: {
		name: "业烬",
		info: "摸牌阶段开始时/出牌阶段开始时/弃牌阶段开始时/当你造成伤害时，你可以清除任意名角色的「出血」层数，然后令你本回合的摸牌数/出【杀】次数/手牌上限/本次造成伤害+X（X为你因此减少的「出血」层数）。",
	},
};
