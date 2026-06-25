import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	forced: true,
	trigger: {
		player: ["phaseEnd", "damageEnd"],
		source: ["damageEnd"],
	},
	unique: true,
	marktext: "狐火",
	mark: true,
	intro: {
		content: "当前拥有$个“狐火”标记",
	},
	init(player, skill) {
		player.addSkill('vl_nanci_tq')
		player.addSkill('vl_nanci_tqg')
		player.addSkill('vl_nanci_tm')
		player.addSkill('vl_nanci_tmg')
		player.addMark('vl_nanci_tj', 2)
		player.addSkillBlocker(skill);
	},
	onremove(player, skill) {
		player.removeSkillBlocker(skill);
		player.removeSkill('vl_nanci_tq')
		player.removeSkill('vl_nanci_tqg')
		player.removeSkill('vl_nanci_tm')
		player.removeSkill('vl_nanci_tmg')
	},
	skillBlocker(skill, player) {
		if (player.countMark('vl_nanci_tj') == 0) {
			return skill == 'vl_nanci_tm' || skill == 'vl_nanci_tmg' || skill == 'vl_nanci_tqg' || skill == 'vl_nanci_tq'
		} else if (player.countMark('vl_nanci_tj') == 1) {
			return skill == 'vl_nanci_tm' || skill == 'vl_nanci_tmg' || skill == 'vl_nanci_tqg'
		} else if (player.countMark('vl_nanci_tj') >= 2 && player.countMark('vl_nanci_tj') <= 3) {
			return skill == 'vl_nanci_tmg' || skill == 'vl_nanci_tqg'
		} else if (player.countMark('vl_nanci_tj') >= 4) {
			return skill == 'vl_nanci_tq' || skill == 'vl_nanci_tm'
		}
	},
	derivation: ["vl_nanci_tq", "vl_nanci_tm", "vl_nanci_tqg", "vl_nanci_tmg"],
	async content(event, trigger, player) {
		if (trigger.name == 'damage') {
			if (trigger.player == player) {
				if (player.countMark('vl_nanci_tj') > 0) player.removeMark('vl_nanci_tj', 1)
				if (player.countMark('vl_nanci_tj') < 4) {
					player.changeAvatarImage('vl_nanci', 'vl_nanci')
				}
			} else {
				if (player.countMark('vl_nanci_tj') < 5) player.addMark('vl_nanci_tj', 1)
				if (player.countMark('vl_nanci_tj') >= 4) {
					player.changeAvatarImage('vl_nanci', 'vl_nanci2')
				}
			}
		} else {
			if (player.countMark('vl_nanci_tj') < 5) player.addMark('vl_nanci_tj', 1)
			if (player.countMark('vl_nanci_tj') >= 4) {
				player.changeAvatarImage('vl_nanci', 'vl_nanci2')
			}
		}
	},
	t: {
		name: "天劫",
		info: `游戏开始时，你获得2个“狐火”标记；回合结束或当你造成伤害时，你获得1个“狐火”；当你受到伤害时，你失去1个“狐火”（你至多有5个“狐火”标记）；根据你“狐火”的数量，你获得以下效果：<li>1个及以上：视为拥有技能${get.poptip("vl_nanci_tq")}<li>2个及以上：视为拥有技能${get.poptip("vl_nanci_tm")}<li>4个及以上：将${get.poptip("vl_nanci_tq")}改为${get.poptip("vl_nanci_tqg")}，将${get.poptip("vl_nanci_tm")}改为${get.poptip("vl_nanci_tmg")}。`,
	},
};
