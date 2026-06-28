import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "dying",
	},
	direct: true,
	forceDie: true,
	mark: true,
	intro: {
		content: "已发动技能$次",
	},
	init(player) {
		if (!player.hasStorage('vl_siji_ys')) player.setStorage('vl_siji_ys', 0)
	},
	filter: (event, player) => {
		return player.countCards('h') > 0 && game.hasPlayer(current => current.countDiscardableCards('h', player) > 0 && current != player)
	},
	async content(event, trigger, player) {
		const discardResult = await player.chooseToDiscard('h', get.prompt2('vl_siji_ys'))
			.set('ai', function (card) {
				if (get.attitude(player, trigger.player) > 0) {
					return 12 - get.value(card)
				} else {
					return -1
				}
			}).forResult();
		if (discardResult.bool) {
			const card1 = discardResult.cards[0];
			const targetResult = await player.chooseTarget(get.prompt('vl_siji_ys'), '弃置一名其他角色的一张牌', function (card, player, target) {
				return target != player && target.countDiscardableCards('h', player) > 0
			}).forResult();
			if (!targetResult.bool) {
				return
			}
			const discardCardResult = await player.discardPlayerCard('h', targetResult.targets[0], true).forResult();
			if (discardCardResult.bool && discardCardResult.cards && discardCardResult.cards.length) {
				const card2 = discardCardResult.cards[0];
				player.setStorage('vl_siji_ys', player.getStorage('vl_siji_ys', 0) + 1)
				if (get.color(card1) === get.color(card2)) {
					await trigger.player.recover()
				}
			} else {
				return
			}
			if (player.getStorage('vl_siji_ys', 0) >= 3) {
				const drawResult = await player.chooseTarget(get.prompt('vl_siji_ys'), '选择一名其他角色，你与其摸牌阶段摸牌+1且手牌上限+1。', function (card, player, target) {
					return target != player
				}).forResult();
				if (drawResult.bool) {
					const target = drawResult.targets[0];
					target.addSkill('vl_siji_ys_draw')
					player.addSkill('vl_siji_ys_draw')
					player.removeSkill('vl_siji_ys')
				}
			}
		} else {
			return
		}
	},
	subSkill: {
		draw: {
			trigger: {
				player: "phaseDrawBegin2",
			},
			mark: true,
			intro: {
				content: "手牌上限+1，摸牌阶段多摸一张牌。",
			},
			forced: true,
			preHidden: true,
			filter(event, player) {
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num++;
			},
			ai: {
				threaten: 1.5,
			},
			mod: {
				maxHandcard(player, num) {
					return num + 1
				},
			},
			_priority: 0,
		},
	},
	t: {
		name: "佑生",
		info: `当一名角色进入濒死状态后，你可以依次弃置自己与一名其他角色各一张手牌，若颜色相同，则该濒死角色回复1点体力。此技能发动三次后，你可以选择一名其他角色，你与其摸牌阶段摸牌+1且手牌上限+1，然后你失去${get.poptip("vl_siji_ys")}。`,
	},
};
