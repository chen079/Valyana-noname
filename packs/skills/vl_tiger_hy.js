import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	multitarget: true,
	multiline: true,
	usable: 1,
	filterTarget(card, player, target) {
		return player.canCompare(target);
	},
	check(target) {
		let player = _status.event.player, targets = _status.event.getTrigger().targets;
		let num = 0, card = { name: 'sha', nature: 'fire', isCard: true };
		let hs = player.getCards('h').sort((a, b) => get.number(b) - get.number(a));
		let ts = target.getCards('h').sort((a, b) => get.number(b) - get.number(a));
		if (get.number(hs[0]) <= Math.min(13, get.number(ts[0]) + num)) {
			return 6 + get.effect(player, card, target, target);
		}
		return get.effect(target, { name: 'guohe_copy2' }, player, player) / 2 + get.effect(target, card, player, player);
	},
	selectTarget: -1,
	async content(event, trigger, player) {
		await player.draw(2)
		if (targets.length == 0) return;
		let result;
		if (targets.length == 1) {
			result = await player.chooseToCompare(targets[0]).forResult()
		} else {
			result = await player.chooseToCompare(targets).setContent('chooseToCompareMeanwhile').forResult()
		}
		if (result.winner) {
			let targets = [player].addArray(event.targets).sortBySeat(player);
			targets.remove(result.winner);
			for (let i = 0; i < targets.length; i++) {
				if (!result.winner.canUse({ name: 'sha', nature: 'fire', isCard: true }, targets[i], false) || !lib.filter.targetEnabled2({ name: 'sha', nature: 'fire', isCard: true }, result.winner, targets[i])) {
					targets.remove(targets[i])
				}
			}
			await result.winner.useCard({ name: 'sha', nature: 'fire', isCard: true }, targets, 'noai').set('addCount', false);
		}
	},
	ai: {
		order: 4,
		result: {
			player: 1,
		},
	},
	t: {
		name: "混元",
		info: "出牌阶段限一次，你可以摸两张牌并与所有其他角色同时拼点，然后赢的角色对所有没赢的角色使用一张火【杀】。",
	},
};
