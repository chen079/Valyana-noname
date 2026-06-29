import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filter(event, player) {
		return ui.cardPile.childElementCount >= 4;
	},
	async content(event, trigger, player) {
		const cards = get.cards(4);
		player.addTempSkill("vl_delta_sy_ig")
		game.cardsGotoOrdering(cards);
		let dialog = ui.create.dialog('算演', cards, true)
		if (!event.isMine()) {
			player.popup('演算成功！');
			await player.gain(cards, 'gain2').gaintag.add('vl_delta_sy')
			player.addTempSkill('vl_delta_sy_1')
			dialog.close()
			return
		}
		let list = cards.map(card => get.number(card));
		while (list.length > 1) {
			const first = await player.chooseControl(list).set('prompt', '选择要算的第一个数字').forResult();
			const num1 = first.control;
			list.splice(list.indexOf(num1), 1);
			const second = await player.chooseControl(list).set('prompt', '选择要算的第二个数字').forResult();
			const num2 = second.control;
			list.splice(list.indexOf(num2), 1);
			const operator = await player.chooseControl(['+', '-', '*', '/', '重做', '放弃']).forResult();
			if (operator.control == '重做') {
				list = cards.map(card => get.number(card));
				continue;
			}
			if (operator.control == '放弃') {
				await player.loseToDiscardpile(cards);
				dialog.close();
				return;
			}
			let count;
			if (operator.control == '+') count = num1 + num2;
			if (operator.control == '-') count = num1 - num2;
			if (operator.control == '*') count = num1 * num2;
			if (operator.control == '/') count = num1 / num2;
			list.push(count);
		}
		if (list[0] == 24) {
			player.popup('演算成功！');
			await player.gain(cards, 'gain2').gaintag.add('vl_delta_sy');
			dialog.close()
			player.addTempSkill('vl_delta_sy_1')
		} else {
			player.popup('演算失败！');
			await player.loseToDiscardpile(cards)
			dialog.close()
			return
		}
	},
	ai: {
		order: 10,
		result: {
			player: 1,
		},
		threaten: 3.2,
	},
	subSkill: {
		"1": {
			shaRelated: true,
			popup: false,
			silent: true,
			charlotte: true,
			init(player) {
				player.markSkill('vl_delta_sy_1');
			},
			onremove(player) {
				player.unmarkSkill('vl_delta_sy_1');
			},
			trigger: {
				player: "useCardToTargeted",
			},
			intro: {
				content: "本回合你的【杀】无距离次数限制且无视防具。",
			},
			forced: true,
			filter(event, player) {
				return event.card.name == 'sha';
			},
			mod: {
				targetInRange(card, player, target, now) {
					if (card.name == 'sha') return true;
				},
				cardUsable(card, player, num) {
					if (card.name == 'sha') return Infinity
				},
			},
			logTarget: "target",
			async content(event, trigger, player) {
				trigger.target.addTempSkill('qinggang2');
				trigger.target.storage.qinggang2.add(trigger.card);
			},
			ai: {
				skillTagFilter(player, tag, arg) {
					if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
					if (arg && arg.name == 'sha') return true;
				},
				unequip_ai: true,
			},
			sub: true,
		},
		ig: {
			mod: {
				ignoredHandcard(card, player) {
					if (card.hasGaintag('vl_delta_sy')) {
						return true;
					}
				},
				cardDiscardable(card, player, name) {
					if (name == 'phaseDiscard' && card.hasGaintag('vl_delta_sy')) {
						return false;
					}
				},
			},
			onremove(player) {
				player.removeGaintag('vl_delta_sy');
			},
			sub: true,
		},
	},
	t: {
		name: "算演",
		info: `出牌阶段限一次，你可以观看牌堆顶的四张牌并进行一次“${get.poptip("caclu")}”，若成功：你获得这四张牌，你通过${get.poptip("vl_delta_sy")}获得的牌不计入当前回合的手牌上限，然后本回合内你的【杀】无距离次数限制且无视防具，否则，你将这些牌置入弃牌堆。`,
	},
};
