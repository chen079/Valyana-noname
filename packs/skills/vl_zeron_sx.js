import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: ["damageAfter", "recoverAfter", "loseHpAfter", "loseAfter", "gainAfter", "turnOverAfter", "linkAfter"],
		global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
	},
	direct: true,
	unique: true,
	filter(event, player, onrewrite) {
		if (event.player != player) return false
		if (player == _status.currentPhase) return false;
		const triggers = ["damageAfter", "recoverAfter", "loseHpAfter", "gainAfter", "turnOverAfter", "linkAfter"]
		if (triggers.includes(onrewrite)) {
			if (event.name == 'recover') {
				return game.hasPlayer(function (current) {
					return current.hp != current.maxHp && current != player;
				});
			} else if (onrewrite == "gainAfter") {
				return event.cards.length > 0
			} else if (["turnOverAfter", "linkAfter"].includes(onrewrite)) {
				return true
			} else {
				return event.num != 0
			}
		} else {
			if (event.name == 'gain' && event.player == player) return false;
			const evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		}
	},
	async content(event, trigger, player) {
		const judgeEvent = player.judge('vl_zeron_sx', function (card) { return (get.color(card) == 'red') ? 1.5 : -0.5 })
		judgeEvent.judge2 = function (result) {
			return result.bool;
		};
		const judgeResult = await judgeEvent.forResult();
		if (judgeResult.judge > 0) {
			let str
			if (trigger.name == 'damage') {
				if (!trigger.nature) {
					str = '令一名角色受到来自' + get.translation(trigger.source) + '的' + get.cnNumber(trigger.num) + '点伤害'
				} else {
					str = '令一名角色受到来自' + get.translation(trigger.source) + '的' + get.cnNumber(trigger.num) + '点' + get.translation(trigger.nature) + '属性伤害'
				}
			} else if (trigger.name == 'recover') {
				str = '令一名角色回复' + trigger.num + '点体力'
			} else if (trigger.name == 'loseHp') {
				str = '令一名角色失去' + trigger.num + '点体力'
			} else if (trigger.name == 'gain') {
				str = '令一名角色摸' + get.cnNumber(trigger.cards.length) + '张牌'
			} else if (trigger.name == 'turnOver') {
				str = '令一名角色翻面'
			} else if (trigger.name = 'link') {
				str = '令一名角色横置'
			} else {
				str = '令一名角色弃置' + get.cnNumber(trigger.cards.length) + '张牌'
			}
			const result = await player.chooseTarget('请选择〖歃血〗的目标', 1, false, function (card, player, target) {
				if (event.name == 'lose') {
					return target.countCards('he') > 0 && target != player
				} else if (event.name == 'recover') {
					return target.hp != target.maxHp && target != player
				}
				return target != player
			}).set('ai', function (target) {
				const player = _status.event.player
				const nature = _status.event.nature
				const judge = _status.event.judge
				const att = get.attitude(player, target)
				if ((judge == 'recover')) {
					return get.recoverEffect(target, player, player)
				} else if (judge == 'gain') {
					return att / Math.sqrt(2 + target.countCards('h'))
				} else if (judge == 'damage') {
					return get.damageEffect(target, target, player, nature)
				} else if (judge == 'losHp') {
					return get.effect(target, { name: 'losehp' }, player, player)
				} else if (judge == 'link') {
					return get.effect(target, { name: 'tiesuo' }, player, player)
				} else if (judge == 'turnOver') {
					if (target.hasSkillTag('noturn')) return 0;
					return att * (target.isTurnedOver() ? 1 : -1)
				} else {
					return get.effect(target, { name: 'guohe_copy2' }, player, player)
				}
			}).set('prompt2', str).set('nature', trigger.nature).set('judge', trigger.name).forResult()
			if (result.bool) {
				event.target = result.targets[0]
				if (trigger.name == 'damage') {
					await event.target.damage(trigger.num, trigger.nature, trigger.source)
				} else if (trigger.name == 'recover') {
					await event.target.recover(trigger.num)
				} else if (trigger.name == 'loseHp') {
					await event.target.loseHp(trigger.num)
				} else if (trigger.name == 'gain') {
					await event.target.draw(trigger.cards.length)
				} else if (trigger.name == 'link') {
					await event.target.link()
				} else if (trigger.name == 'turnOver') {
					await event.target.turnOver()
				} else {
					await event.target.chooseToDiscard('he', trigger.cards.length, true)
				}
			}
		}
	},
	t: {
		name: "歃血",
		info: "当你于回合外受到伤害/失去体力/回复体力/失去牌/获得牌/横置/翻面后，你进行一次判定，若结果为红色，你可以令一名其他角色受到等量伤害/失去等量体力/回复等量体力/弃置等量的牌/摸等量的牌/横置/翻面。",
	},
};
