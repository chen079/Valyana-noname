import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    filter: function filter(event, player) {
					return event.card && event.isFirstTarget && event.card.name === "sha" && player.countCards("e") > 0;
				},
    cost: async function cost(event, trigger, player) {
					const suits = [];
					player.getCards("e").forEach(i => suits.add(get.suit(i)));
					event.result = await player.chooseCard(suits.length, "he", (card, player) => {
						if (!lib.filter.cardRecastable(card, player)) return false;
						return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
					}).set("prompt", "列装：重铸" + get.cnNumber(suits.length) + "张花色不同的牌").set("complexCard", true).forResult();
				},
    content: async function content(event, trigger, player) {
					const cards = event.cards;
					await player.recast(event.cards);
					await trigger.target.chooseToDiscard("h", event.cards.length, true);
					trigger.baseDamage+=cards.filter(card => get.type(card) === "equip").length;
					// player.when({ global: "damageBegin" })
					// 	.filter(evt => evt.getParent("useCard") === event.getParent("useCard") && evt.player === event.target)
					// 	.then(() => {
					// 		trigger.num += num;
					// 	})
					// 	.vars({ num: event.cards.filter(card => get.type(card) === "equip").length });
				},
    mod: {
        cardUsable: function cardUsable(card, player, num) {
						if (card.name === "sha") return num + 1;
					},
    },
    t: {
        name: "列装",
        info: "每阶段你可以多使用一张【杀】 。每回合限两次，当你使用【杀】指定目标后，你可以重铸X张不同花色的牌令目标弃X张手牌（X为你装备区的花色数），每重铸一张装备牌，此【杀】伤害+1。",
    },
};
