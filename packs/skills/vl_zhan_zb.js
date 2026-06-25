import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseBegin",
	},
	filter(event, player) {
		return event.player.hp < player.maxHp && event.player != player
	},
	check(event, player) {
		return get.attitude(player, event.player) < 0
	},
	content: async function content(event, trigger, player) {
		const result = await player.chooseNumbers(get.prompt2(event.name), [{ prompt: '请选择数量', min: 1, max: player.maxHp }], true)
			.set("processAI", function () {
				const player = _status.event.player;
				if (trigger.player.isUnknown()) return [1]
				return [Math.min(trigger.player.hp, player.getDamagedHp())]
			}).forResult();
		if (result.bool) {
			const num = result.numbers[0];
			await player.loseMaxHp(num);
			await trigger.player.damage(num, player, 'thunder');
		}
	},
	t: {
		name: "震爆",
		info: "一名角色的回合开始时，若你的体力上限大于其体力值，你可以失去任意点体力上限并对其造成等量雷电伤害。",
	},
};
