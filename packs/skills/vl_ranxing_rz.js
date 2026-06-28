import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "dying",
	},
	locked: true,
	filter(event, player) {
		return event.player && event.player.isAlive() && !player.getStorage('vl_ranxing_rz_doing', false);
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0 || (get.attitude(player, event.player) < 0 && player.hp > player.getStorage('vl_ranxing_rz_count', 0) + 1);
	},
	async content(event, trigger, player) {
		player.setStorage('vl_ranxing_rz_doing', true);
		try {
			if (!player.hasStorage('vl_ranxing_rz_count')) player.setStorage('vl_ranxing_rz_count', 0);
			player.setStorage('vl_ranxing_rz_count', player.getStorage('vl_ranxing_rz_count', 0) + 1);
			const num = player.getStorage('vl_ranxing_rz_count', 0);
			if (num > 0) await player.loseHp(num);
			const result = await player.chooseControl('获得并令其死亡', '令其回复至满').set('choiceList', [
				'获得其所有牌与武将技能，然后其立即死亡，你变更势力至与其相同',
				'其回复体力至满'
			]).set('ai', function () {
				const player = _status.event.player;
				const target = _status.event.target;
				if (get.attitude(player, target) < 0) return '获得并令其死亡';
				return '令其回复至满';
			}).set('target', trigger.player).forResult();
			if (result.control == '获得并令其死亡') {
				const cards = trigger.player.getCards('hej');
				if (cards.length) await player.gain(cards, trigger.player, 'giveAuto');
				const skills = trigger.player.getSkills(null, false, false).filter(function (skill) {
					const info = lib.skill[skill];
					return info && !info.charlotte && !info.hiddenSkill;
				});
				for (const skill of skills) {
					if (!player.hasSkill(skill)) player.addSkill(skill);
				}
				if (trigger.player.group) player.changeGroup(trigger.player.group);
				await trigger.player.die(player);
			} else {
				await trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
			}
		} finally {
			player.setStorage('vl_ranxing_rz_doing', false);
		}
	},
	t: {
		name: "燃忠",
		info: "锁定技，当有角色陷入濒死状态时，你可选择失去X点体力。（X为〖燃忠〗的发动次数），然后选择一项：<br/>1.获得其所有牌与武将技能，然后其立即死亡，你变更势力至与其相同。<br/>2.其回复体力至满。",
	},
};
