import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "damageBefore",
	},
	usable: 1,
	filter(event, player) {
		return player.inRange(event.player) && event.player != player && event.source != player;
	},
	logTarget(event, player) {
		return event.player
	},
	check(event, player) {
		return get.attitude(player, event.player) > 0
	},
	async content(event, trigger, player) {
		while (true) {
			const result = await player.judge().forResult();
			if (result.color == 'red') {
				trigger.cancel();
				await player.damage(trigger.source, trigger.nature);
				return;
			}
			await player.draw();
			await trigger.player.draw();
		}
	},
	t: {
		name: "移能",
		info: "每回合限一次，在你攻击距离内的角色受到来源不为你的伤害时，你可以进行判定。若结果为红色，该角色免除此次伤害，然后你受到1点同来源同属性的伤害；若为黑色，你与该角色各摸一张牌并重新开始判定。",
	},
};
