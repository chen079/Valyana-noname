import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseEnd",
    },
    filter: (event, player) => game.hasPlayer(
					current => current != player && player.inRange(current) && player.countCards('h', { suit: 'club' }) > 0
				),
    init: (player) => {
					if (!player.storage.vl_yinlong_jh) player.storage.vl_yinlong_jh = [2, 1]
				},
    direct: true,
    content: function () {
					'step 0'
					player.chooseCardTarget({
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
					})
					'step 1'
					if (result.bool) {
						player.storage.vl_yinlong_jh.swapElements(0, 1)
						player.discard(result.cards)
						result.targets[0].damage(player)
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
            content: () => {
							'step 0'
							var cards = game.getInCenter().filter(i => get.suit(i) == 'club')
							player.chooseCardButton([1, 2], cards, '获得其中至多两张牌').set('ai', function (button) {
								return get.value(button.link, _status.event.player);
							})
							'step 1'
							if (result.bool) {
								var cards = result.links
								player.gain(cards, 'draw')
							}
							'step 2'
							var next = player.chooseCard('he', '将一张牌置于牌堆顶？', true);
							next.set('ai', function (card) {
								var player = _status.currentPhase, js = player.next.getCards('j');
								if (js.length) {
									var judge = get.judge(js[0]);
									if (judge && (judge(card) + 0.01) * get.attitude(player, player.next) > 0) return 20 - get.value(card);
								}
								return 0;
							});
							'step 3'
							if (result.bool) {
								player.$throw(get.position(result.cards[0]) == 'e' ? result.cards[0] : 1, 1000);
								game.log(player, '将', get.position(result.cards[0]) == 'e' ? result.cards[0] : '#y一张手牌', '置于了牌堆顶');
								player.lose(result.cards, ui.cardPile, 'insert');
							} else event.finish();
							'step 4'
							game.updateRoundNumber();
							game.delayx();
						},
        },
    },
    t: {
        name: "陈波",
        info: "回合结束时，你可以弃置一张♣牌对攻击范围内一名其他角色造成1点伤害，若如此做，交换「vl_yinlong_jh」中的蓝色数字。其他角色的回合结束时，你可以获得「center」至多两张的♣牌，然后你将一张牌置于牌堆顶。",
    },
};
