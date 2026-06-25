import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		target: "useCardToTargeted",
	},
	init(player, storage) {
		if (!player.storage.vl_fate_ss) player.storage.vl_fate_ss = 25
		if (!player.storage.vl_fate_ss_round) player.storage.vl_fate_ss_round = 0
	},
	popup: false,
	filter(event, player) {
		return event.player != player && event.targets.length == 1
	},
	check(event, player) {
		return get.effect(player, event.card, event.player, player) < 0;
	},
	marktext: "闪避",
	mark: true,
	intro: {
		markcount(storage, player) {
			return (player.storage.vl_fate_ss + player.storage.vl_fate_ss_round);
		},
		mark(dialog, storage, player) {
			dialog.addText('当前闪避值为：' + (player.storage.vl_fate_ss + player.storage.vl_fate_ss_round));
		},
	},
	async content(event, trigger, player) {
		let num;
		if (get.isLuckyStar(player)) {
			num = 1
		} else {
			num = Math.floor(Math.random() * 100) + 1
		}
		game.log(player, 'D100投掷的结果为', '#g' + num)
		player.popup(num)
		await game.delay(2)
		if (num <= player.storage.vl_fate_ss + player.storage.vl_fate_ss_round) {
			if (num == 1) {
				player.popup('大成功')
				trigger.excluded.add(player)
				await trigger.player.damage(1, player)
				return
			}
			player.popup('成功')
			trigger.excluded.add(player)
		} else if (num == 100) {
			player.popup('大失败')
			trigger.getParent('useCard').effectCount++;
			if (player.storage.vl_fate_ss_round + player.storage.vl_fate_ss + 10 <= 100) {
				player.storage.vl_fate_ss_round += 10
			} else {
				player.storage.vl_fate_ss_round += (100 - player.storage.vl_fate_ss - player.storage.vl_fate_ss_round)
			}
		} else {
			player.popup('失败')
			if (player.storage.vl_fate_ss_round + player.storage.vl_fate_ss + 10 <= 100) {
				player.storage.vl_fate_ss_round += 10
			} else {
				player.storage.vl_fate_ss_round += (100 - player.storage.vl_fate_ss - player.storage.vl_fate_ss_round)
			}
		}
	},
	group: "vl_fate_ss_clean",
	subSkill: {
		clean: {
			trigger: {
				global: ["phaseBefore", "phaseAfter"],
			},
			charlotte: true,
			forced: true,
			popup: false,
			async content(event, trigger, player) {
				player.storage.vl_fate_ss_round = 0
				player.updateMark('vl_fate_ss')
			},
			sub: true,
		},
	},
	t: {
		name: "瞬闪",
		info: "当你成为其他角色使用牌的唯一目标时，你可以进行一次r1D100，若结果不大于你的闪避值：<font color=\"blue\">25</font>，你取消之，否则，你本回合内的闪避值+10；若结果为1，你额外对该角色造成1点伤害，若结果为100，你令此牌对你结算两次。",
	},
};
