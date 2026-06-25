import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    unique: true,
    filter: function (event, player) {
					if (!event.source) return false
					if (event.num >= player.maxHp) return false
					if (get.gainableSkillsName(event.source.name, function (info, skill, name) {
						if (info.fixed || info.unique || info.zhuSkill || info.charlotte || info.yunlvSkill || info.qianghua || info.hiddenSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable)) return false
						if (player.hasSkill(skill)) return false
						return true
					}).length > 0) return true
					return false
				},
    init: function (player) {
					if (!player.storage.vl_tery_hx) player.storage.vl_tery_hx = [[], []]
				},
    check: function (event, player) {
					if (player.hp == player.maxHp && event.num == 1) return false
					if (player.hp < player.maxHp - 1 || (player.hp <= 2 && event.num >= 2)) return true;
					return false
				},
    content: function () {
					'step 0'
					trigger.cancel()
					'step 1'
					player.loseMaxHp(trigger.num)
					'step 2'
					player.chooseSkill(trigger.source.name, function (info, skill, name) {
						if (info.fixed || info.unique || info.zhuSkill || info.charlotte || info.yunlvSkill || info.qianghua || info.hiddenSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable)) return false
						if (player.hasSkill(skill)) return false
						return true
					})
					'step 3'
					player.addSkill(result.skill);
					player.popup(result.skill);
					game.log(player, '获得技能', '【' + get.translation(result.skill) + '】');
					trigger.source.removeSkill(result.skill)
					game.log(trigger.source, '失去技能', '【' + get.translation(result.skill) + '】')
					player.storage.vl_tery_hx[0].push(trigger.source)
					player.storage.vl_tery_hx[1].push(result.skill)
				},
    ai: {
        maixie_defend: true,
        effect: {
            target: function (card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
							return 0.8;
							// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
						},
        },
    },
    group: "vl_tery_hx_die",
    subSkill: {
        die: {
            forceDie: true,
            trigger: {
                global: "die",
            },
            filter: function (event, player) {
							return player.storage.vl_tery_hx[0].length
						},
            direct: true,
            content: function () {
							if (trigger.player == player) {
								for (var i = 0; i < player.storage.vl_tery_hx[0].length; i++) {
									if (player.storage.vl_tery_hx[0][i].isAlive()) {
										player.storage.vl_tery_hx[0][i].addSkill(player.storage.vl_tery_hx[1][i])
										if (player.hasSkill(player.storage.vl_tery_hx[1][i])) player.removeSkill(player.storage.vl_tery_hx[1][i])
									}
								}
							} else {
								for (var i = 0; i < player.storage.vl_tery_hx[0].length; i++) {
									if (player.storage.vl_tery_hx[0][i] == trigger.player) {
										if (player.hasSkill(player.storage.vl_tery_hx[1][i])) {
											player.removeSkill(player.storage.vl_tery_hx[1][i])
											player.storage.vl_tery_hx[1].remove(player.storage.vl_tery_hx[1][i])
											player.storage.vl_tery_hx[0].remove(player.storage.vl_tery_hx[0][i])
										}
									}
								}
							}
						},
        },
    },
    t: {
        name: "幻形",
        info: "当你受到不大于你体力上限的伤害时，若伤害来源存在你没有获得过的技能，你可以免除此次伤害并改为失去等于此伤害值的体力上限，然后你获得伤害来源的一个技能直到其死亡（觉醒技，限定技，主公技，隐匿技，使命技等特殊技能除外），然后令该角色失去此技能；当你死亡时，你归还你获得的所有技能。",
    },
};
