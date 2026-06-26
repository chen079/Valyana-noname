import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseDrawBegin2",
	},
	direct: true,
	preHidden: true,
	filter(event, player) {
		return event.num > 0 && !event.numFixed && game.hasPlayer(function (target) {
			return target.countCards('h') > 0 && player != target;
		});
	},
	async content(event, trigger, player) {
		let num = get.copy(trigger.num);
		if (get.mode() == 'guozhan' && num > 2) num = 2;
		const result = await player.chooseTarget(get.prompt('vl_muen_tx'), '选择至多' + get.translation(num) + '名角色，对手牌数少于你的角色视为使用一张【杀】，然后获得这些角色的各一张手牌，并少摸等量的牌', [1, num], function (card, player, target) {
			return target.countCards('h') > 0 && player != target;
		}, function (target) {
			let att = get.attitude(_status.event.player, target);
			if (target.hasSkill('tuntian')) return att / 10;
			return 1 - att;
		}).setHiddenSkill('vl_muen_tx').forResult();
		if (result.bool) {
			let list = []
			for (let i = 0; i < result.targets.length; i++) {
				if (player.countCards('h') <= result.targets[i].countCards('h')) {
					list.add(result.targets[i])
				}
			}
			if (list) {
				list.sortBySeat()
				for (let i = 0; i < list.length; i++) {
					await player.useCard({ name: 'sha' }, list[i], false)
				}
			}
			result.targets.sortBySeat();
			player.logSkill('vl_muen_tx', result.targets);;
			await player.gainMultiple(result.targets)
			trigger.num -= result.targets.length;
		} else {
			return
		}
		if (trigger.num <= 0) await game.delay();
	},
	ai: {
		threaten: 1.6,
		expose: 0.2,
	},
	t: {
		name: "巧手",
		info: "摸牌阶段，你可少摸任意张牌，然后选择等量的角色，若你的手牌数不大于其，则视为你对其使用一张【杀】（不计入出杀次数），然后你获得这些角色的各一张手牌。",
	},
};
