import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "dyingBefore",
	},
	marktext: "引",
	intro: {
		markcount: "expansion",
		mark(dialog, content, player) {
			let expansions = player.getExpansions('vl_rasali_ly');
			if (expansions && expansions.length) {
				if (player == game.me || player.isUnderControl()) {
					dialog.addAuto(expansions);
				}
				else {
					return '共有' + get.cnNumber(expansions.length) + '张引';
				}
			}
		},
		content(content, player) {
			let expansions = player.getExpansions('vl_rasali_ly');
			if (expansions && expansions.length) {
				if (player == game.me || player.isUnderControl()) {
					return get.translation(expansions);
				}
				return '共有' + get.cnNumber(expansions.length) + '张引';
			}
		},
	},
	onremove(player, skill) {
		let cards = player.getExpansions(skill);
		if (cards.length) player.loseToDiscardpile(cards);
	},
	usable: 1,
	frequent: true,
	content: async function content(event, trigger, player) {
		await player.addToExpansion(get.cards(4), 'gain2').gaintag.add('vl_rasali_ly');
		let cards = player.getExpansions('vl_rasali_ly');
		if (!cards.length) return
		if (player.countCards('h')) {
			let next = player.chooseToMove('对' + get.translation(trigger.player) + '发动【灵引】：交换“引”和手牌？');
			next.set('list', [
				[get.translation(player) + '（你）的引', cards],
				['手牌区', player.getCards('h')],
			]);
			next.set('filterMove', function (from, to) {
				return typeof to != 'number';
			});
			next.set('processAI', function (list) {
				let player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
					return get.useful(a) - get.useful(b);
				}), cards2 = cards.splice(0, player.getExpansions('vl_rasali_ly').length);
				return [cards2, cards];
			});
			let result = await next.forResult();
			if (result.bool) {
				const pushs = result.moved[0], gains = result.moved[1];
				pushs.removeArray(player.getExpansions('vl_rasali_ly'));
				gains.removeArray(player.getCards('h'));
				if (!pushs.length || pushs.length != gains.length) return;
				await player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('vl_rasali_ly');
				game.log(player, '将', pushs, '作为“引”置于武将牌上');
				await player.gain(gains, 'draw');
			}
		}
		cards = player.getExpansions('vl_rasali_ly');
		const suit = []
		const color = []
		for (let i of cards) {
			if (!suit.includes(get.suit(i))) {
				suit.push(get.suit(i))
			}
			if (!color.includes(get.color(i))) {
				color.push(get.color(i))
			}
		}
		if (suit.length == cards.length) {
			await player.discard(cards)
			player.line(trigger.player)
			await trigger.player.die()
			if (player.countCards('h') == 0 && game.me == player && player.isCharacter('vl_rasali')) {
			}
		}
		if (color.length == 1) {
			await trigger.player.recover(1 - trigger.player.hp)
			await trigger.player.gain(cards, player, 'giveAuto')
			await trigger.player.chooseToDiscard('h', 2, true)
		}
		if (suit.length == 1) {
			await trigger.player.recover(1)
			if (trigger.player.countCards('h') < trigger.player.maxHp) {
				await trigger.player.draw(2)
			}
			trigger.player.addMark('vl_rasali_ly_shan', 1)
		}
		cards = player.getExpansions('vl_rasali_ly');
		if (cards.length) {
			await player.gain(cards, 'gain2')
			await player.chooseToDiscard('h', 2, true)
		}
	},
	group: "vl_rasali_ly_shan",
	subSkill: {
		shan: {
			trigger: {
				global: "damageBegin3",
			},
			marktext: "善",
			intro: {
				mark(dialog, storage, player) {
					dialog.addText('你可以免疫接下来' + get.cnNumber(storage) + '次伤害，若此伤害有来源，' + get.translation(player) + '对伤害来源造成1点伤害。')
				},
			},
			direct: true,
			filter(event, player) {
				return event.player.countMark('vl_rasali_ly_shan') > 0 && event.num > 0
			},
			async content(event, trigger, player) {
				trigger.cancel()
				if (trigger.source) {
					await trigger.source.damage(player)
				}
				trigger.player.removeMark('vl_rasali_ly_shan', 1)
			},
		},
	},
	t: {
		name: "灵引",
		info: "每回合限一次，一名角色进入濒死状态前，你可以将牌堆顶的四张牌置于你的武将牌上称为“引”，然后你可以任意交换你的“引”和手牌并依次执行：<li>①若“引”的花色均不同，你弃置所有“引”并令该角色立即死亡，<li>②若“引”的颜色均相同，你交给该角色所有“引”并令该角色将体力值回复至1点，然后该角色弃置两张手牌，<li>③若“引”的花色均相同，该角色回复1点体力值并摸两张牌，然后该角色获得1个“善”标记，<li>④若你的武将牌上有“引”，获得的所有“引”然后弃置两张手牌。</li>一名有“善”的角色受到伤害时，其移去1个“善”然后免除此次伤害，若此伤害有来源，你对该伤害来源造成1点伤害。",
	},
};
