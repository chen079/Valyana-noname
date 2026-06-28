import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterCard: card => !card.hasGaintag('vl_mile_tl'),
	filterTarget: true,
	selectTarget: 1,
	check(card) {
		if (get.type(card) != 'basic' && get.type(card) != 'trick') return 0;
		return get.value(card) - 7.5;
	},
	position: "h",
	selectCard: true,
	discard: false,
	lose: false,
	delay: false,
	async content(event, trigger, player) {
		const targets = event.targets
		const cards = event.cards
		let card = cards[0];
		let cardx = game.createCard(card.name, card.suit, card.number, card.nature);
		player.markSkill('vl_mile_tl');
		await targets[0].gain(cardx).gaintag.add('vl_mile_tl');
		targets[0].addSkill('vl_mile_tl_effect');
		targets[0].setStorage('vl_mile_tl_effect', player);
	},
	ai: {
		order: 15,
		result: {
			target: 3,
		},
	},
	subSkill: {
		effect: {
			mod: {
				aiOrder(player, card, num) {
					if (num > 0 && get.itemtype(card) === 'card' && card.hasGaintag('vl_mile_tl')) return num + 0.16;
				},
				aiValue(player, card, num) {
					if (num > 0 && get.itemtype(card) === 'card' && card.hasGaintag('vl_mile_tl')) return 2 * num;
				},
				aiUseful(player, card, num) {
					if (num > 0 && !player._vl_mile_tl_mod && get.itemtype(card) === 'card' && card.hasGaintag('vl_mile_tl')) {
						if (player.canIgnoreHandcard(card)) return Infinity;
						player._vl_mile_tl_mod = true;
						if (player.hp < 3 && player.needsToDiscard(player.countCards('h', (cardx) => {
							if (player.canIgnoreHandcard(cardx) || get.useful(cardx) > 6) return true;
							return false;
						}))) return num * 1.5;
						return num * 10;
					}
				},
			},
			trigger: {
				player: ["useCardAfter", "respondAfter"],
			},
			charlotte: true,
			forced: true,
			filter(event, player) {
				return player.hasHistory('lose', function (evt) {
					if (evt.getParent() != event) return false;
					for (let i in evt.gaintag_map) {
						if (evt.gaintag_map[i].includes('vl_mile_tl')) {
							if (event.cards.some(card => {
								return get.position(card, true) == 'o' && card.cardid == i;
							})) return true;
						}
					}
					return false;
				});
			},
			async content(event, trigger, player) {
				let cards = [];
				player.getHistory('lose', function (evt) {
					if (evt.getParent() != trigger) return false;
					for (let i in evt.gaintag_map) {
						if (evt.gaintag_map[i].includes('vl_mile_tl')) {
							let cardsx = trigger.cards.filter(card => {
								return get.position(card, true) == 'o' && card.cardid == i;
							});
							if (cardsx.length) cards.addArray(cardsx);
						}
					}
				});
				if (cards.length) {
					await player.gain(cards, 'gain2').gaintag.addArray(['vl_mile_tl', 'vl_mile_tl_clear']);
					player.addTempSkill('vl_mile_tl_clear');
					const target = player.getStorage('vl_mile_tl_effect', null);
					if (target) await target.draw();
				}
			},
			sub: true,
			_priority: 0,
		},
		clear: {
			charlotte: true,
			onremove(player) {
				player.removeGaintag('vl_mile_tl_clear');
			},
			mod: {
				cardEnabled2(card, player) {
					let cards = [];
					if (card.cards) cards.addArray(cards);
					if (get.itemtype(card) == 'card') cards.push(card);
					for (let cardx of cards) {
						if (cardx.hasGaintag('vl_mile_tl_clear')) return false;
					}
				},
				cardRespondable(card, player) {
					let cards = [];
					if (card.cards) cards.addArray(cards);
					if (get.itemtype(card) == 'card') cards.push(card);
					for (let cardx of cards) {
						if (cardx.hasGaintag('vl_mile_tl_clear')) return false;
					}
				},
				cardSavable(card, player) {
					let cards = [];
					if (card.cards) cards.addArray(cards);
					if (get.itemtype(card) == 'card') cards.push(card);
					for (let cardx of cards) {
						if (cardx.hasGaintag('vl_mile_tl_clear')) return false;
					}
				},
			},
			sub: true,
			_priority: 0,
		},
	},
	t: {
		name: "通灵",
		info: `出牌阶段限一次，你可以选择一张非“灵体”手牌复制之，然后交给一名角色称为“灵体”。一名角色使用或打出此“灵体”结算结束后(装备牌除外)，其获得之，然后其本回合不能再使用或打出此牌并令你摸一张牌。`,
        taici: ['铁律如山，众心归一。', '秩序不是枷锁，是我的王冠。'],
    },
};
