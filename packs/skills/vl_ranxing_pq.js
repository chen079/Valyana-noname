import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "dying",
	},
	juexingji: true,
	forced: true,
	unique: true,
	skillAnimation: true,
	animationColor: "fire",
	filter(event, player) {
		return !player.getStorage('vl_ranxing_pq', false);
	},
	async content(event, trigger, player) {
		player.awakenSkill('vl_ranxing_pq');
		player.setStorage('vl_ranxing_pq', true);
		await player.gainMaxHp();
		await player.recover(player.maxHp - player.hp);
		const targets = game.filterPlayer(current => current != game.zhu).sortBySeat();
		if (targets.length > 1) {
			const result = await player.chooseTarget(targets.length, '破契：可以依次选择角色重新分配座次', function (card, player, target) {
				return _status.event.targets.includes(target);
			}).set('targets', targets).set('ai', function (target) {
				return Math.random();
			}).forResult();
			if (result.bool && result.targets.length > 1) {
				const seats = targets.slice(0);
				const ordered = result.targets.slice(0);
				for (let i = 0; i < ordered.length; i++) {
					const current = ordered[i];
					const seat = seats[i];
					if (current != seat) {
						game.broadcastAll(function (target1, target2) {
							game.swapSeat(target1, target2);
						}, current, seat);
						const index = seats.indexOf(current);
						if (index >= 0) seats[index] = seat;
						seats[i] = current;
					}
				}
			}
		}
		player.addSkill('vl_ranxing_rz');
	},
	derivation: "vl_ranxing_rz",
	t: {
		name: "破契",
		info: "<b>觉醒技</b>，当你进入濒死状态时，你增加1点体力上限并将体力回复至上限；然后你可以重新分配除主公外每名角色的座次，并获得技能<b>〖燃忠〗</b>。",
        taici: ['破穹一击，云海皆裂。', '我燃起的星，不会坠落。'],
    },
};
