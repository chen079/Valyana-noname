import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["phaseBefore", "die"],
        player: "enterGame",
    },
    marktext: "☠️",
    intro: {
        content: "$已被死亡的暗影盯上...",
    },
    filter: function (event, player) {
					if (event.name == 'die') {
						return event.player == player.storage.vl_death_sy
					} else {
						return event.name != 'phase' || game.phaseNumber == 0;
					}
				},
    forced: true,
    content: function () {
					'step 0'
					if (player.storage.vl_death_sy) {
						player.storage.vl_death_sy.removeSkill("vl_death_sy_useless")
						player.storage.vl_death_sy.unmarkSkill('vl_death_sy')
					}
					player.chooseTarget('选择你的猎物', function (card, target, player) {
						return target != player && player.storage.vl_death_sy != target
					}, true).set('ai', function (target) {
						var player = _status.event.player
						return -get.attitude(player, target)
					})
					'step 1'
					if (result.bool) {
						player.storage.vl_death_sy = result.targets[0]
						result.targets[0].storage.vl_death_sy = player
						player.markSkill('vl_death_sy')
						result.targets[0].addSkill("vl_death_sy_useless")
					}
				},
    derivation: "vl_death_sy_useless",
    group: ["vl_death_sy_begin"],
    subSkill: {
        begin: {
            trigger: {
                global: "phaseAfter",
            },
            filter: function (event, player) {
							return event.player == player.storage.vl_death_sy
						},
            forced: true,
            content: function () {
							"step 0"
							if (trigger.player.next != player) {
								game.broadcastAll(function (target1, target2) {
									game.swapSeat(target1, target2);
								}, player, trigger.player.next);
							} else {
								player.insertPhase();
							}
						},
        },
        useless: {
            init: function (player, skill) {
							player.addSkillBlocker(skill);
						},
            onremove: function (player, skill) {
							player.removeSkillBlocker(skill);
						},
            charlotte: true,
            skillBlocker: function (skill, player) {
							return _status.currentPhase == player.storage.vl_death_sy && !lib.skill[skill].charlotte && skill != 'vl_death_sy_useless';
						},
            mark: true,
            intro: {
                content: function (storage, player, skill) {
								var list = player.getSkills(null, false, false).filter(function (i) {
									return lib.skill.vl_death_sy_useless.skillBlocker(i, player);
								});
								if (list.length) return '失效技能：' + get.translation(list);
								return '无失效技能';
							},
            },
        },
    },
    t: {
        name: "随影",
        info: "锁定技。①游戏开始时，你选择一名其他角色称为“猎物”并令其获得「vl_death_sy_useless」且你对其使用牌无距离限制，当其回合结束后，若其下家不为你，你与该角色的下家交换位置，否则，你执行一个额外的回合；②当“猎物”死亡时，你可以重新选择一名其他角色称为“猎物”并令其获得「vl_death_sy_useless」。",
    },
};
