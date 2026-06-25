import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseJieshuBegin",
	},
	direct: true,
	async content(event, trigger, player) {
		const result = await player.chooseCardTarget({
			filterTarget: function (card, playr, target) {
				return target != player
			},
			selectCard: function () {
				return _status.event.player.hp
			},
			prompt: get.prompt2('vl_baliqiao_sj'),
			ai1: function (card) {
				return 7 - get.value(card);
			},
			ai2: function (target) {
				if (player.hp <= 2) {
					return -get.attitude(player, target)
				} else {
					return -1
				}
			},
			filterCard: true,
			selectTarget: 1,
		}).forResult();
		if (result.bool) {
			player.logSkill("vl_baliqiao_sj");
			game.log(player, "交给了", result.targets[0], result.cards.length, "张牌");
			await result.targets[0].gain(result.cards)
			result.targets[0].addTempSkill('vl_baliqiao_sj_1', { player: "phaseAfter" })
			result.targets[0].storage.vl_baliqiao_sj_1 = player
		}
	},
	subSkill: {
		"1": {
			trigger: {
				player: "useCardAfter",
			},
			mark: true,
			intro: {
				content: "当你使用牌后，交给$一张牌。",
			},
			filter(event, player) {
				return player.countCards('he') > 0
			},
			async content(event, trigger, player) {
				const next = player.chooseCard('将一张牌交给' + get.translation(player.storage.vl_baliqiao_sj_1), 'he', true);
				next.ai = function (card) {
					if (get.type(card) == 'trick') return 8 - get.value(card);
					return 6 - get.value(card);
				};
				const result = await next.forResult();
				if (result.bool && result.cards.length) {
					await player.storage.vl_baliqiao_sj_1.gain(result.cards, player, 'give');
				}
			},
		},
	},
	t: {
		name: "丝尽",
		info: "结束阶段，你可以交给一名其他角色X张手牌（X为你的体力值）。若如此做，其下一个回合内使用牌时，其需交给你一张牌。",
	},
};
