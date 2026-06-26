import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterTarget(card, player, target) {
		return target.countCards('h') > 0
	},
	async content(event, trigger, player) {
		const target = event.target
		await player.viewHandcards(target);
		let choice = [], choiceList = [];
		let cards = target.getCards('h');
		if (cards.some(i => get.color(i) == 'black')) {
			choice.push('black');
			choiceList.push(cards.filter(i => get.color(i) == 'black').map(i => get.translation(i)));
		}
		if (cards.some(i => get.color(i) == 'red')) {
			choice.push('red');
			choiceList.push(cards.filter(i => get.color(i) == 'red').map(i => get.translation(i)));
		}
		const result = await player.chooseControl(choice).set('choiceList', choiceList).set('ai', function () {
			let blackvalue = cards.reduce((previous, current) => {
				if (get.color(current) == 'black') {
					return previous + get.value(current, player);
				} else {
					return previous;
				}
			}, 0) / (cards.filter(i => get.color(i) == 'black').length + 1);
			let redvalue = cards.reduce((previous, current) => {
				if (get.color(current) == 'red') {
					return previous + get.value(current, player);
				} else {
					return previous;
				}
			}, 0) / (cards.filter(i => get.color(i) == 'red').length + 1);
			if (blackvalue > redvalue && choice.includes('black')) return 'black';
			if (redvalue > blackvalue && choice.includes('red')) return 'red';
			return choice.randomGet();
		}).forResult();
		if (result.control == 'red') {
			await target.recast(target.getCards('h', { color: 'red' }));
		} else {
			await target.recast(target.getCards('h', { color: 'black' }));
		}
		await target.recover();
	},
	ai: {
		order: 9,
		result: {
			target(player, target) {
				if (target.hp == 1) return 5 + target.countCards('h');
				if (player == target) return 5 + target.countCards('h');
				return 2;
			},
		},
		threaten: 2,
	},
	t: {
		name: "四诊",
		info: "出牌阶段限一次，你可以观看一名角色手牌并选择一种颜色，然后其重铸该颜色的手牌并回复1点体力。",
	},
};
