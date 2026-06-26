import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseUseBegin",
	},
	direct: true,
	async content(event, trigger, player) {
		const targetResult = await player.chooseTarget(1, get.prompt2('vl_guotang_xq'), function (card, player, target) {
			return target != player
		}).set('ai', function (target) {
			let player = _status.event.player
			let att = get.attitude(player, target)
			return att
		}).forResult();
		if (!targetResult.bool) return;
		const target = targetResult.targets[0];
		let choice = [], choiceList = [];
		if (player.countCards('h') > 0) {
			choiceList.push('令' + get.translation(player) + '交给你一张牌');
			choice.push('拿牌');
		}
		if (target.countCards('h') > 0) {
			choiceList.push('交给不为' + get.translation(player) + '的其他角色一张牌，若你因此失去最后一张手牌，则' + get.translation(player) + '可令一名角色摸两张牌');
			choice.push('给牌');
		}
		if (!choice.length) return;
		const control = await target.chooseControl(choice).set('choiceList', choiceList)
			.set('ai', function () {
				let player = _status.event.player;
				let target = _status.event.target;
				if (choice.length == 1) return choice[0];
				if (get.attitude(player, target) < 0) return '拿牌';
				if (player.countCards('h') == 1) return '给牌';
				if (target.countCards('h') > 3 && player.countCards('h') <= 2) return '拿牌';
				return '给牌';
			}).set('target', player).forResult();
		if (control.control == '拿牌') {
			const give = await player.chooseCard('he', 1, true, '交给' + get.translation(target) + '一张牌').forResult();
			await target.gain(give.cards, 'giveAuto', player);
			return;
		}
		const giveResult = await target.chooseCardTarget({
			filterTarget: function (card, player, target) {
				let source = _status.event.source
				return _status.event.player != target && source != target;
			},
			position: 'he',
			ai1: function (card) {
				return 100 - get.value(card);
			},
			forced: true,
			ai2: function (target) {
				return get.attitude(event.target, target)
			},
			prompt: '交给一名不为' + get.translation(player) + '的其他角色一张牌',
		}).set('source', player).forResult();
		await target.give(giveResult.cards, giveResult.targets[0]);
		if (target.countCards('h') == 0) {
			const drawResult = await player.chooseTarget('令一名角色摸两张牌', 1).set('ai', function (target) {
				let player = _status.event.player
				return get.attitude(player, target)
			}).forResult();
			if (drawResult.bool) await drawResult.targets[0].draw(2);
		}
	},
	t: {
		name: "系群",
		info: "出牌阶段开始时，你可以选择一名其他角色，其选择一项：1.你交给其一张牌，2.其交给另一名其他角色一张牌，若其因此失去最后一张手牌，则你可令一名角色摸两张牌。",
	},
};
