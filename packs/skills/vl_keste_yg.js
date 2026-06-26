import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterTarget(card, player, target) {
		return player != target;
	},
	async content(event, trigger, player) {
		const target = event.target;
		let targets = game.filterPlayer(current => {
			return current != target;
		});
		player.chooseToDebate(targets).set('callback', function () {
			let result = event.debateResult;
			if (result.bool && result.opinion) {
				let opinion = result.opinion;
				let target = event.getParent(2).target;
				if (opinion == 'red') {
					for (let i = 0; i < result.red.length; i++) {
						let people = result.red[i][0]
						if (people.canUse({ name: 'sha', isCard: true }, target) && people.countCards('h') > 0 && lib.filter.targetInRange({ name: 'sha' }, people, target) && lib.filter.targetEnabled({ name: 'sha' }, people, target) && target.isAlive()) {
							player.discardPlayerCard(people, 'h', 1, true)
							people.useCard({ name: 'sha', isCard: true }, target);
						}
					}
				} else {
					for (let i = 0; i < result.black.length; i++) {
						let people = result.black[i][0]
						player.gainPlayerCard(people, 'hej', true)
					}
				};
			}
		}).set('ai', card => {
			let player = _status.event.player;
			let color = (player == _status.event.source || get.damageEffect(_status.event.getParent(2).target, player, player) > 0) ? 'black' : 'red';
			let val = 5 - get.value(card);
			if (get.color(card) == color) val += 10;
			return val;
		}).set('aiCard', target => {
			let color = (target == _status.event.source || get.damageEffect(_status.event.getParent(2).target, target, target) > 0) ? 'black' : 'red';
			let hs = target.getCards('h', { color: color });
			if (!hs.length) hs = target.getCards('h');
			return { bool: true, cards: [hs.randomGet()] };
		}).set('target', target);
	},
	ai: {
		order: 8,
		expose: 0.2,
		result: {
			target: -1,
		},
	},
	t: {
		name: "议攻",
		info: "出牌阶段限一次，你可以选择一名角色并令该角色外的角色议事，若结果为：红色，你弃置意见为红色且可以对该角色使用【杀】的角色一张手牌，然后对视为该角色使用一张【杀】；黑色：你获得意见为黑色的角色区域内的一张牌。",
	},
};
