import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "damageEnd",
	},
	frequent: true,
	filter(event, player) {
		if (!event.source || event.source.isDead()) return true
		return false
	},
	async content(event, trigger, player) {
		await player.draw()
		let next = player.chooseTarget(1, false).set("prompt", "请选择一名其他角色").set("prompt2", "该角色选择一项：1.交给你一张牌、2.视为你对其使用一张火【杀】。")
		next.set("filterTarget", function (event, player, target) {
			return player != target
		})
		next.ai = function (target) {
			return -get.attitude(_status.event.player, target) / (1 + target.countCards('h'));
		};
		const result = await next.forResult();
		if (result.bool) {
			const target = result.targets[0];
			next = target.chooseCard(1, 'he').set('prompt', "交给" + get.translation(player) + "一张牌或视为其对你使用一张【杀】")
			next.ai = function (card) {
				return 6 - get.value(card);
			}
			const cardResult = await next.forResult();
			if (cardResult.cards && cardResult.bool) {
				if (player.isIn()) {
					await player.gain(cardResult.cards, target, 'giveAuto');
				}
			} else {
				await player.useCard({ name: 'sha', nature: 'fire' }, target, false);
			}
		} else {
			return
		}
	},
	ai: {
		maixie: true,
	},
	group: "vl_nore_ys_1",
	subSkill: {
		"1": {
			trigger: {
				global: "damageEnd",
			},
			direct: true,
			filter(event, player) {
				if (event.player != player && (!event.source || event.source.isDead())) return true
				return false
			},
			async content(event, trigger, player) {
				const result = await trigger.player.chooseToDiscard('he', '弃置一张牌，或令' + get.translation(player) + '摸一张牌').set('ai', function (card) {
					if (_status.event.goon) return 7 - get.value(card);
					return -get.value(card);
				}).set('goon', get.attitude(trigger.player, player) < 0).forResult();
				if (!result.bool) await player.draw();
			},
			sub: true,
		},
	},
    t: {
        name: "渊薮",
        info: "一名角色受到无来源伤害后，若该角色为你，你摸一张牌，然后你可以令一名其他角色选择一项：<li>1.交给你一张牌，<li>2.你视为对其使用一张火【杀】；</li>若该角色不为你，该角色选择一项：<li>1.令你摸一张牌，<li>2.弃置一张牌。",
        taici: ["从渊里捞出来的，终究要还。", "伤没来处，选择倒有去处。"],
    },
};
