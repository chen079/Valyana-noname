import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	trigger: {
		player: "damageBegin3",
	},
	forced: true,
	popup: false,
	filter() {
		return true;
	},
	async content(event, trigger, player) {
		trigger.cancel();
		await player.loseMaxHp(1);
		await player.changeHujia(trigger.num, null, true);
	},
	group: "vl_yue_hengshen_mod",
	subSkill: {
		mod: {
			mod: {
				cardUsable(card, player, num) {
					if (!player.isPhaseUsing()) return;
					if (player.getHistory("useCard").length <= Math.max(0, player.getDamagedHp())) return Infinity;
				},
				targetInRange(card, player, target) {
					if (!player.isPhaseUsing()) return;
					if (player.getHistory("useCard").length <= Math.max(0, player.getDamagedHp())) return true;
				},
			},
			sub: true,
		},
	},
	t: {
		name: "横身",
		info: "锁定技，你回合内使用的前X张牌无距离次数限制（X为你已损失生命值），当你受到伤害时，取消之并失去1点生命上限，然后并获得等同于此次伤害的护盾值。",
	},
};
