import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
        global: "roundStart",
    },
    forceunique: true,
    fixed: true,
    limited: false,
    charlotte: true,
    mark: true,
    supercharlotte: true,
    content: function () {
					"step 0"
					var skills = get.gainableSkills(function (info, skill) {
						if (info.fixed || info.unique || info.zhuSkill || info.charlotte || info.yunlvSkill || info.qianghua || info.hiddenSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable)) return false
						if (player.hasSkill(skill)) return false
						return true
					}, player)
					event.skills = skills
					player.chooseText(6, true, event.skills.map(i => get.translation(i))).set('ai', function () {
						return get.translation(skills.randomGet())
					}).set('prompt', get.prompt2('vl_yifa_xs'))
					"step 1"
					event.choice = event.skills.filter(function (item) {
						return get.translation(item) == result.text
					})
					if (event.choice.length == 1) {
						var skills2 = event.choice[0]
						if (trigger.name == "phaseZhunbei") {
							player.addTempSkill(skills2, { player: "phaseEnd" });
						} else if (trigger.name == "phaseJieshu") {
							player.addTempSkill(skills2, { player: "phaseBegin" });
						} else {
							player.addTempSkill(skills2, 'roundStart');
						}
						player.popup(skills2);
						game.log(player, '声明了', '#g' + '【' + get.translation(skills2) + '】');
						event.finish()
					} else {
						var list = []
						var skills = event.choice
						for (var i = 0; i < skills.length; i++) {
							list.push(get.translation(skills[i] + '_info'))
						}
						player.chooseControl().set('choiceList', list).set('prompt', '选择〖' + get.translation(skills[0]) + '〗的版本')
					}
					"step 2"
					var skills2 = event.choice[result.index]
					if (trigger.name == "phaseZhunbei") {
						player.addTempSkill(skills2, { player: "phaseEnd" });
					} else if (trigger.name == "phaseJieshu") {
						player.addTempSkill(skills2, { player: "phaseBegin" });
					} else {
						player.addTempSkill(skills2, 'roundStart');
					}
					player.popup(skills2);
					game.log(player, '声明了', '#g' + '【' + get.translation(skills2) + '】');
				},
    ai: {
        threaten: 6,
    },
    t: {
        name: "宣誓",
        info: "一轮游戏开始时/准备阶段/结束阶段，你可以声明一个技能，然后你拥有此技能直到本轮结束/回合结束/你的下个回合开始（觉醒技，限定技，主公技，隐匿技，使命技等特殊技能除外）。",
    },
};
