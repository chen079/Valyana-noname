import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	trigger: {
		player: "damageBegin3",
	},
	forced: true,
	filter(event, player) {
		return event.num > 0;
	},
	async content(event, trigger, player) {
		const num = trigger.num;
		trigger.cancel();
		await player.loseMaxHp();
		await player.changeHujia(num, null, true);
	},
	mod: {
		targetInRange(card, player, target) {
			if (target != player && target.hp <= player.hp) return true;
		},
	},
	t: {
		name: "化躯",
		info: "锁定技，体力值小于等于你的角色视为在你的攻击范围内。当你因伤害造成体力值减少时，改为失去1点体力上限，并获得等同于此次伤害值的护盾。",
	},
};
