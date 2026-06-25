import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "die",
    },
    filter: function (event, player) {
					return event.player.getStockSkills().filter(function (skill) {
						var info = get.info(skill);
						return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
					}).length > 0;
				},
    logTarget: "player",
    direct: true,
    content: function () {
					'step 0'
					var list = trigger.player.getStockSkills().filter(function (skill) {
						var info = get.info(skill);
						return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
					});
					if (list.length == 1) event._result = { control: list[0] };
					else player.chooseControl(list, 'cancel2').set('prompt', '选择获得' + get.translation(trigger.player) + '的一个技能').set('forceDie', true).set('ai', function () {
						return list.randomGet();
					});
					'step 1'
					if (result.control != 'cancel2') {
						player.addSkillLog(result.control);
						game.broadcastAll(function (skill) {
							var list = [skill]; game.expandSkills(list);
							for (var i of list) {
								var info = lib.skill[i];
								if (!info) continue;
							}
						}, result.control);
					} else {
						event.finish()
					}
					'step 2'
					if (trigger.source == player) {
						player.gainMaxHp()
						player.recover()
					}
				},
    t: {
        name: "餮魂",
        info: "一名角色死亡时，你可以选择获得其的一个非特殊技能，若该角色是你杀死的，你增加1点体力上限并回复1点体力。",
    },
};
