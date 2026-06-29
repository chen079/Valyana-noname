import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: ["chooseToRespondBegin", "chooseToUseBegin"],
	},
	forced: true,
	lastDo: true,
	mark: true,
	hiddenCard(player, name) {
		let cardPile = Array.from(ui.cardPile.childNodes);
		if (!cardPile.length) return false;
		let num = 1 + player.getDamagedHp();
		cardPile = cardPile.slice(0, Math.min(num, cardPile.length));;
		return cardPile.some(i => i.name == name);
	},
	filter(event, player) {
		if (event.responded || event.skill) return false;
		let cardPile = Array.from(ui.cardPile.childNodes);
		if (!cardPile.length) return false;
		let num = 1 + player.getDamagedHp();
		cardPile = cardPile.slice(0, Math.min(num, cardPile.length));
		return cardPile.some(i => event.filterCard && event.filterCard(i, player, event));
	},
	mod: {
		cardEnabled2(card, player) {
			if (_status.event.skill && get.itemtype(card) == 'card' && card.hasGaintag('vl_lamost_zf')) return false;
		},
	},
	intro: {
		mark(dialog, storage, player) {
			let cardPile = Array.from(ui.cardPile.childNodes);
			if (!cardPile.length) return '';
			let num = 1 + player.getDamagedHp();
			cardPile = cardPile.slice(0, Math.min(num, cardPile.length));
			if (player.isUnderControl(true)) {
				dialog.addAuto(cardPile);
			} else {
				return '';
			}
		},
	},
	copy(cards) {
		let result = [];
		for (let i of cards) {
			let card = ui.create.card(ui.special);
			card.init([
				i.suit,
				i.number,
				i.name,
				i.nature,
			]);
			card.cardid = i.cardid,
				card.wunature = i.wunature,
				card.storage = i.storage,
				card.relatedCard = i;
			result.push(card);
		};
		return result;
	},
	async contentx(event, trigger, player) {
		if (trigger.result.bool) {
			if (trigger.onresult) {
				trigger.onresult(trigger.result);
				delete trigger.onresult;
			};
		};
		const next = player.lose(event.cards, ui.special);
		next._triggered = null;
		await next;
		for (let i of event.cards) {
			i.fix();
			i.remove();
			i.destroyed = true;
		};
	},
	async content(event, trigger, player) {
		let cardPile = Array.from(ui.cardPile.childNodes);
		let num = 1 + player.getDamagedHp();
		cardPile = cardPile.slice(0, Math.min(num, cardPile.length));
		event.cards = lib.skill.vl_lamost_zf.copy(cardPile);
		player.directgains(event.cards, null, 'vl_lamost_zf');
		await game.delay();
		let evt = trigger;
		let onresult = false;
		if (evt.onresult) {
			onresult = evt.onresult;
		};
		let next2 = game.createEvent('vl_lamost_zf_clear', false);
		next2.cards = event.cards;
		next2.player = player;
		next2._trigger = evt;
		next2.setContent(lib.skill.vl_lamost_zf.contentx);
		event.next.remove(next2);
		evt.after.push(next2);
		evt.onresult = function (result) {
			if (evt.after.includes(next2)) {
				evt.after.remove(next2);
				evt.next.push(next2);
			};
			if (result.cards && result.cards.length && (result.cards[0].hasGaintag('vl_lamost_zf') || event.cards.includes(result.cards[0]))) {
				let card2 = result.cards[0];
				result.cards[0] = result.cards[0].relatedCard;
				let cardx = result.cards[0];
				result.card = {
					name: get.name(card2),
					suit: get.suit(card2),
					number: get.number(card2),
					nature: get.nature(card2),
					isCard: true,
					cardid: cardx.cardid,
					wunature: cardx.wunature,
					storage: cardx.storage,
					cards: [cardx],
				};
			};
			if (onresult) onresult.apply(evt, arguments);
			delete evt.onresult;
		};
		await game.delay(1);
		let cards = player.getCards("hs");
		let sort2 = function (b, a) {
			if (a.name != b.name) return lib.sort.card(a.name, b.name);
			else if (a.suit != b.suit) return lib.suit.indexOf(a) - lib.suit.indexOf(b);
			else return a.number - b.number;
		};
		if (cards.length > 1) {
			cards.sort(sort2);
			cards.forEach(function (i, j) {
				player.node.handcards1.insertBefore(cards[j], player.node.handcards1.firstChild);
			});
		}
	},
	ai: {
		respondShan: true,
		respondSha: true,
		save: true,
		skillTagFilter(player, tag, arg) {
			let event = _status.event;
			let cardPile = Array.from(ui.cardPile.childNodes);
			if (!cardPile.length) return false;
			let num = 1 + player.getDamagedHp();
			cardPile = cardPile.slice(0, Math.min(num, cardPile.length));
			for (let i = 0; i < cardPile.length; i++) {
				if (tag == 'respondSha') {
					if (cardPile[i].name == 'sha') return true;
				} else if (tag == 'respondShan') {
					if (cardPile[i].name == 'shan') return true;
				} else if (tag == 'save') {
					if (cardPile[i].name == 'jiu' || cardPile[i].name == 'tao') return true;
				};
			};
			return false;
		},
	},
    t: {
        name: "知繁",
        info: "锁定技，牌堆顶X+1张牌始终对你可见；你可将牌堆顶X+1张牌如手牌般使用或打出。（X为你的已损失体力值）",
        taici: ["看得越多，能用的越多。", "繁华没了，牌还在。"],
    },
};
