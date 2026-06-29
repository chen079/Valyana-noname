import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	filterTarget(card, player, target) {
		if (player == target) return false;
		if (player.countCards('h') == 0) return false;
		return true;
	},
	usable: 1,
	async content(event, trigger, player) {
		let num = 1;
		while (true) {
			const bool = await event.target.chooseBool('是否令' + get.translation(player) + '摸' + get.cnNumber(num) + '张牌').set('ai', function () {
				let player = _status.event.player
				let target = _status.event.target
				if (get.attitude(player, target) > 0) {
					return true
				} else {
					return false
				}
			}).set('target', player).forResult();
			if (!bool.bool) return;
			await player.draw(num);
			const cards = await player.chooseCard('h', 2 * num, false).set('prompt', '是否交给' + get.translation(event.target) + get.cnNumber(2 * num) + '张手牌').set('ai', function (card) {
				let player = _status.event.player
				let target = _status.event.target
				if (get.attitude(player, target) > 0) {
					return 9 - get.value(card)
				} else {
					return -1
				}
			}).set('target', event.target).forResult();
			if (!cards.bool) return;
			await event.target.gain(cards.cards, player, 'giveAuto');
			num++;
		}
	},
	ai: {
		result: {
			target(player, target) {
				return 1;
			},
			player(player, target) {
				return 1;
			},
		},
		order: 14,
	},
	t: {
		name: "存生",
		info: `出牌阶段限一次，你可以令一名其他角色选择是否令你摸X张牌，然后你可以交给其2X张手牌并重复此流程（X为本回合内你发动${get.poptip("vl_laays_cs")}的次数）。`,
	},
};
