import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "useCardToTargeted",
	},
	direct: true,
	filter(event, player) {
		if (event.player == player || event.target == player) return false;
		if (!event.targets || event.targets.length != 1) return false;
		if (!event.card || get.type(event.card) == 'equip' || get.type(event.card) == 'delay') return false;
		return lib.filter.targetEnabled(event.card, event.player, player);
	},
	async content(event, trigger, player) {
		const result = await player.chooseBool(get.prompt('vl_ranxing_tx', trigger.target), '摸一张牌并代替其成为此牌目标').set('ai', function () {
			const player = _status.event.player;
			const source = _status.event.source;
			const target = _status.event.target;
			const card = _status.event.card;
			return get.effect(player, card, source, player) > get.effect(target, card, source, player);
		}).set('source', trigger.player).set('target', trigger.target).set('card', trigger.card).forResult();
		if (!result.bool) return;
		player.logSkill('vl_ranxing_tx', trigger.target);
		await player.draw();
		const evt = trigger.getParent();
		if (evt?.triggeredTargets2) evt.triggeredTargets2.remove(trigger.target);
		trigger.targets.remove(trigger.target);
		trigger.targets.push(player);
		player.setStorage('vl_ranxing_sy_targeted', true);
		trigger.player.line(player);
	},
	t: {
		name: "同心",
		info: "其他角色使用仅指定一名目标的即时牌时，你可以摸一张牌并代替其成为此牌目标。",
	},
};
