import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["useCardAfter"],
        global: "dyingBefore",
    },
    usable: 3,
    filter: function (event, player, name) {
					if (player.storage.hubian && name == 'useCardAfter') {
						if (['equip', 'delay'].includes(get.type(event.card))) return false;
						if (event.cards.filterInD().length <= 0) return false;
						if (_status.currentPhase != player) return false
						return true
					} else if (name == 'dyingBefore' && !player.storage.hubian) {
						if (_status.currentPhase == player) return false
						return player.countCards('h') > 0 && event.player != player
					} else {
						return false
					}
				},
    check: function (event, player) {
					if (player.storage.hubian) {
						return true;
					} else {
						return get.attitude(player, event.player) < 0
					}
				},
    content: function () {
					"step 0"
					if (!player.storage.hubian) {
						event.goto(3)
					}
					'step 1'
					event.cards = trigger.cards.filterInD();
					if (event.cards.length > 1) {
						var next = player.chooseToMove('盈亏：将牌按顺序置于牌堆顶');
						next.set('list', [['牌堆顶', event.cards]]);
						next.set('reverse', ((_status.currentPhase && _status.currentPhase.next) ? get.attitude(player, _status.currentPhase.next) > 0 : false));
						next.set('processAI', function (list) {
							var cards = list[0][1].slice(0);
							cards.sort(function (a, b) {
								return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
							});
							return [cards];
						});
					}
					"step 2"
					if (result.bool && result.moved && result.moved[0].length) var cards = result.moved[0].slice(0);
					while (cards.length) {
						var card = cards.pop();
						if (get.position(card, true) == 'o') {
							card.fix();
							ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
							game.log(player, '将', card, '置于牌堆顶');
						}
					}
					game.updateRoundNumber();
					player.draw('bottom');
					event.finish()
					'step 3'
					player.chooseCard(1, 'h', true).set('ai', function (card) {
						return 5 - get.value(card)
					})
					'step 4'
					player.useCard(result.cards, { name: 'sha' }, trigger.player, false).viewAs = true;
				},
    t: {
        name: "盈亏",
        info: "「hubianji」，每回合限三次，<li>圣咏：你的回合内，当你使用一张即时牌结算完毕后，你可以将此牌置于牌堆顶，然后从牌堆底摸一张牌；<li>暗涌：你的回合外，当一名其他角色进入濒死状态时，你可以将一张手牌当【杀】对其使用。",
    },
};
