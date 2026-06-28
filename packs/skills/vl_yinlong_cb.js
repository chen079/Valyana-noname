import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseEnd",
	},
	filter: (event, player) => game.hasPlayer(
		current => current != player && player.inRange(current) && player.countCards('h', { suit: 'club' }) > 0
	),
	init: (player) => {
		if (!player.hasStorage('vl_yinlong_jh')) player.setStorage('vl_yinlong_jh', [2, 1])
	},
	direct: true,
	async content(event, trigger, player) {
		const result = await player.chooseCardTarget({
			position: 'he',
			filterCard: function (card) {
				return get.suit(card) == 'club'
			},
			filterTarget: function (card, player, target) {
				return player.inRange(target);
			},
			ai1: function (card) {
				return 7 - get.value(card)
			},
			prompt: get.prompt2('vl_yinlong_cb'),
			ai2: function (target) {
				return -get.attitude(player, target)
			}
		}).forResult();
		if (result.bool) {
			player.setStorage('vl_yinlong_jh', [player.getStorage('vl_yinlong_jh', [2, 1])[1], player.getStorage('vl_yinlong_jh', [2, 1])[0]])
			await player.discard(result.cards)
			await result.targets[0].damage(player)
		}
	},
	ai: {
		threaten: 2,
	},
	group: "vl_yinlong_cb_gain",
	subSkill: {
		gain: {
			trigger: {
				global: ["phaseEnd"],
			},
			frequent: true,
			filter: (event, player) => {
				return game.getInCenter().filter(i => get.suit(i) == 'club').length > 0 && event.player != player
			},
			async content(event, trigger, player) {
				let cards = game.getInCenter().filter(i => get.suit(i) == 'club')
				let result = await player.chooseCardButton([1, 2], cards, '获得其中至多两张牌').set('ai', function (button) {
					return get.value(button.link, _status.event.player);
				}).forResult();
				if (result.bool) {
					let cards = result.links
					await player.gain(cards, 'draw')
				}
				result = await player.chooseCard('he', '将一张牌置于牌堆顶？', true).set('ai', function (card) {
					let player = _status.currentPhase, js = player.next.getCards('j');
					if (js.length) {
						let judge = get.judge(js[0]);
						if (judge && (judge(card) + 0.01) * get.attitude(player, player.next) > 0) return 20 - get.value(card);
					}
					return 0;
				}).forResult();
				if (result.bool) {
					player.$throw(get.position(result.cards[0]) == 'e' ? result.cards[0] : 1, 1000);
					game.log(player, '将', get.position(result.cards[0]) == 'e' ? result.cards[0] : '#y一张手牌', '置于了牌堆顶');
					await player.lose(result.cards, ui.cardPile, 'insert');
				} else return;
				game.updateRoundNumber();
				game.delayx();
			},
		},
	},
	t: {
		name: "陈波",
		info: `回合结束时，你可以弃置一张♣牌对攻击范围内一名其他角色造成1点伤害，若如此做，交换${get.poptip("vl_yinlong_jh")}中的蓝色数字。其他角色的回合结束时，你可以获得${get.poptip("center")}至多两张的♣牌，然后你将一张牌置于牌堆顶。`,
	},
};
