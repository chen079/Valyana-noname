import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseDrawAfter",
	},
	direct: true,
	filter(event, player) {
		return player.getExpansions('vl_markn_yz').length > 0 && player.countCards('h') > 0;
	},
	intro: {
		markcount: "expansion",
		mark(dialog, content, player) {
			let expansions = player.getExpansions('vl_markn_yz');
			if (expansions && expansions.length) {
				if (player == game.me || player.isUnderControl()) {
					dialog.addAuto(expansions);
				}
				else {
					return '共有' + get.cnNumber(expansions.length) + '张视';
				}
			}
		},
		content(content, player) {
			let expansions = player.getExpansions('vl_markn_yz');
			if (expansions && expansions.length) {
				if (player == game.me || player.isUnderControl()) {
					return get.translation(expansions);
				}
				return '共有' + get.cnNumber(expansions.length) + '张视';
			}
		},
	},
	content: async function content(event, trigger, player) {
		const cards = player.getExpansions('vl_markn_yz');
		if (!cards.length || !player.countCards('h')) return;
		const next = player.chooseToMove('远瞻：是否交换“视”和手牌？');
		next.set('list', [
			[get.translation(player) + '（你）的视', cards],
			['手牌区', player.getCards('h')],
		]);
		next.set('filterMove', function (from, to) {
			return typeof to != 'number';
		});
		next.set('processAI', function (list) {
			let player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
				return get.value(a) - get.value(b);
			}), cards2 = cards.splice(0, player.getExpansions('vl_markn_yz').length);
			return [cards2, cards];
		});
		const result = await next.forResult();
		if (!result.bool) return;
		const pushs = result.moved[0], gains = result.moved[1];
		pushs.removeArray(player.getExpansions('vl_markn_yz'));
		gains.removeArray(player.getCards('h'));
		if (!pushs.length || pushs.length != gains.length) return;
		await player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('vl_markn_yz');
		game.log(player, '将', pushs, '作为“视”置于武将牌上');
		await player.gain(gains, 'gain2');

	},
	group: ["vl_markn_yz_1", "vl_markn_yz_2"],
	subSkill: {
		"1": {
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter(event, player) {
				return player.getExpansions('vl_markn_yz').length > 0;
			},
			frequent: true,
			async content(event, trigger, player) {
				await player.chooseToGuanxing(player.getExpansions('vl_markn_yz').length);
			},
			ai: {
				threaten: 1.2,
			},
			sub: true,
		},
		"2": {
			trigger: {
				player: "damageEnd",
				source: "damageSource",
			},
			direct: true,
			async content(event, trigger, player) {
				await player.addToExpansion(get.cards(trigger.num), 'gain2').gaintag.add('vl_markn_yz');
			},
			sub: true,
		},
	},
	t: {
		name: "远瞻",
		info: "当你造成或受到伤害后，你可以将牌堆顶的X张牌称为“视”置于你的武将牌上（X为此次伤害值）。准备阶段，若你有“视”，你可以卜算Y（Y为“视”的数量）；摸牌阶段结束后，你可以用任意手牌等量交换“视”。",
	},
};
