import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	trigger: {
		player: "changeHp",
	},
	forced: true,
	filter(event, player) {
		return event.num < 0 && event.changedHp < 0 && event.getParent().name == "damage";
	},
	async content(event, trigger, player) {
		const num = -trigger.changedHp;
		trigger.cancel()
		await player.loseMaxHp();
		await player.changeHujia(num, null, true);
	},
	mod: {
		targetInRange(card, player, target) {
			if (target != player && target.hp >= player.hp) return true;
		},
	},
	t: {
		name: "化躯",
		info: "锁定技。摸牌阶段，你额外摸X张牌（X为你的护甲值）。体力值大于等于你的角色视为在你的攻击范围内。当你因伤害使体力值减少时，取消之，然后你失去1点体力上限，并获得等同于此次体力减少值的护甲。",
        taici: ['寒泉入刃，月魄凝霜。', '清辉所至，杀意无尘。'],
    },
	group: "vl_yue_hq_draw",
	subSkill: {
		draw: {
			trigger: {
				player: "phaseDrawBegin2"
			},
			forced:true,
			async content(event, trigger, player) {
				trigger.num += player.hujia
			}
		}
	}
};
