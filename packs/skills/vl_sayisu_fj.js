import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	marktext: "正",
	intro: {
		mark(dialog, storage, player) {
			dialog.addAuto(player.getCards('s', function (card) {
				return card.hasGaintag('vl_sayisu_fj');
			}));
		},
		markcount(storage, player) {
			return player.getCards('s', function (card) {
				return card.hasGaintag('vl_sayisu_fj');
			}).length;
		},
		onunmark(storage, player) {
			var cards = player.getCards('s', function (card) {
				return card.hasGaintag('vl_sayisu_fj');
			});
			if (cards.length) {
				player.lose(cards, ui.discardPile);
				player.$throw(cards, 1000);
				game.log(cards, '进入了弃牌堆');
			}
		},
	},
	mod: {
		aiOrder(player, card, num) {
			if (get.itemtype(card) == 'card' && card.hasGaintag('vl_sayisu_fj')) return num + 0.5;
		},
	},
	trigger: {
		player: "phaseZhunbeiBegin",
	},
	cost: async function cost(event, trigger, player) {
		const result = await player
			.chooseControl("1", "2", "3", "4", "cancel2")
			.set("prompt", get.prompt("vl_sayisu_fj"))
			.set("prompt2", "妄行：将X张牌置于武将牌上，称为“威”")
			.set("ai", function () {
				var player = _status.event.player;
				if (player.maxHp > 3) {
					return 3;
				}
				return Math.min(3, player.countCards("he") + 1);
			})
			.forResult();
		event.result = { bool: true, cost_data: result.index }
	},
	content: async function content(event, trigger, player) {
		const num = event.cost_data + 1, cards = get.cards(num);
		player.addTempSkill('wangxing');
		player.addMark('wangxing', num, false);
		player.$gain2(cards, false);
		game.log(player, '将', cards, '放到了武将牌上');
		await player.loseToSpecial(cards, 'vl_sayisu_fj').set("visible", true);
		player.markSkill('vl_sayisu_fj');
		game.delayx();
	},
	group: "vl_sayisu_fj_gain",
	subSkill: {
		gain: {
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter(event, player) {
				return player.isMinHandcard() && player.maxHp < 5
			},
			forced: true,
			async content(event, trigger, player) {
				player.gainMaxHp()
				player.recover()
			},
		},
	},
	t: {
		name: "斧正",
		info: "①妄行：准备阶段，你可以将牌堆顶的X张牌置于你的武将牌上，称为“正”，你可以如手牌般使用或打出“正”。②结束阶段，若你的手牌数为全场最少且体力上限小于5，你增加1点体力上限并回复1点体力。",
	},
};
