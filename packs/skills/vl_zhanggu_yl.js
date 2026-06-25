import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "loseHpEnd",
    },
    check: function (event, player) {
					return get.attitude(player, event.player) > 0
				},
    filter: function (event, player) {
					return event.player.isAlive() && get.gainableSkillsName(event.player.name, function (info, skill, name) {
						return !get.is.locked(skill) && !get.is.blocked(skill, event.player)
					}).length > 0
				},
    content: function () {
					'step 0'
					player.chooseSkill(trigger.player, get.prompt2('vl_zhanggu_yl'), function (info, skill, name) {
						return !get.is.locked(skill) && !get.is.blocked(skill, trigger.player)
					})
					'step 1'
					if (!trigger.player.storage.vl_zhanggu_yl_blocker) trigger.player.storage.vl_zhanggu_yl_blocker = []
					trigger.player.storage.vl_zhanggu_yl_blocker.push(result.skill)
					if (!trigger.player.hasSkill('vl_zhanggu_yl_blocker')) trigger.player.addTempSkill('vl_zhanggu_yl_blocker', { player: 'phaseAfter' })
				},
    subSkill: {
        blocker: {
            init: function (player, skill) {
							player.addSkillBlocker(skill);
						},
            onremove: function (player, skill) {
							player.removeSkillBlocker(skill);
							player.storage.vl_zhanggu_yl_blocker = []
						},
            charlotte: true,
            skillBlocker: function (skill, player) {
							return player.storage.vl_zhanggu_yl_blocker.includes(skill);
						},
            mark: true,
            intro: {
                content: function (storage, player, skill) {
								var list = player.getSkills(null, false, false).filter(function (i) {
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
    },
};
