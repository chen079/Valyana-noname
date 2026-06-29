import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "dying",
	},
	locked: true,
	filter(event, player) {
		return event.player && event.player != player && event.player.isAlive() && !player.getStorage('vl_ranxing_rz_doing', false);
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0 || (get.attitude(player, event.player) < 0 && player.hp > player.getStorage('vl_ranxing_rz_count', 0) + 1);
	},
	async content(event, trigger, player) {
		player.setStorage('vl_ranxing_rz_doing', true);
		try {
			if (!player.hasStorage('vl_ranxing_rz_count')) player.setStorage('vl_ranxing_rz_count', 0);
			const num = player.getStorage('vl_ranxing_rz_count', 0);
			player.setStorage('vl_ranxing_rz_count', num + 1);
			if (num > 0) await player.loseHp(num);
			const result = await player.chooseControl('获得并令其死亡', '令其回复至满').set('choiceList', [
				'获得其所有牌与所有技能，然后其立即死亡；若你不为主公，则你可以与其交换身份牌',
				'其将体力回复至上限；若其不为主公，则其将身份牌变更至与你相同'
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
				if (player.identity != 'zhu') {
					const result = await player.chooseBool('是否与' + get.translation(trigger.player) + '交换身份牌？').set('ai', function () {
						const player = _status.event.player;
						const target = _status.event.target;
						if (target.identity == 'zhu') return false;
						return get.attitude(player, target) < 0;
					}).set('target', trigger.player).forResult();
					if (result.bool) lib.skill.vl_ranxing_rz.changeIdentity(player, trigger.player);
				}
				await trigger.player.die(player);
			} else {
				await trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
				if (trigger.player.identity != 'zhu') lib.skill.vl_ranxing_rz.changeIdentity(trigger.player, player.identity);
			}
		} finally {
			player.setStorage('vl_ranxing_rz_doing', false);
		}
	},
	changeIdentity(target, source) {
		if (typeof source == 'string') {
			target.identity = source;
			target.setIdentity(source);
			return;
		}
		const identity = target.identity;
		target.identity = source.identity;
		source.identity = identity;
		target.setIdentity(target.identity);
		source.setIdentity(source.identity);
	},
	t: {
		name: "燃忠",
		info: `锁定技，当其他角色陷入濒死状态时，你可选择失去X点体力（X为此前${get.poptip("vl_ranxing_rz")}发动过的次数），然后选择一项：<br/>1.获得其所有牌与其所有技能，然后其立即死亡；若你不为主公，则你可以与其交换身份牌。<br/>2.其将体力回复至上限；若其不为主公，则其将身份牌变更至与你相同。`,
	},
};
