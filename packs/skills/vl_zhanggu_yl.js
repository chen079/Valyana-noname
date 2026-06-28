import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "loseHpEnd",
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0
	},
	filter(event, player) {
		return event.player.isAlive() && get.gainableSkillsName(event.player.name, function (info, skill, name) {
			return !get.is.locked(skill) && !get.is.blocked(skill, event.player)
		}).length > 0
	},
	async content(event, trigger, player) {
		const result = await player.chooseSkill(trigger.player, get.prompt2('vl_zhanggu_yl'), function (info, skill, name) {
			return !get.is.locked(skill) && !get.is.blocked(skill, trigger.player)
		}).forResult();
		trigger.player.markAuto('vl_zhanggu_yl_blocker', result.skill)
		if (!trigger.player.hasSkill('vl_zhanggu_yl_blocker')) trigger.player.addTempSkill('vl_zhanggu_yl_blocker', { player: 'phaseAfter' })
	},
	subSkill: {
		blocker: {
			init(player, skill) {
				player.addSkillBlocker(skill);
			},
			onremove(player, skill) {
				player.removeSkillBlocker(skill);
				player.setStorage('vl_zhanggu_yl_blocker', [])
			},
			charlotte: true,
			skillBlocker(skill, player) {
				return player.getStorage('vl_zhanggu_yl_blocker', []).includes(skill);
			},
			mark: true,
			intro: {
				content(storage, player, skill) {
					const list = player.getSkills(null, false, false).filter(function (i) {
						return lib.skill.vl_zhanggu_yl_blocker.skillBlocker(i, player);
					});
					if (list.length) return '失效技能：' + get.translation(list);
					return '无失效技能';
				},
			},
		},
	},
	t: {
		name: "邀离",
		info: "当一名角色失去体力后，你可以令其武将牌上的一个非锁定技失效直至其回合结束。",
        taici: ['幽瘴成帘，生机尽隐。', '药可救人，也可送终。'],
    },
};
