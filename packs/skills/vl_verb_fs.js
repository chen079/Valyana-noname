import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToTargeted",
    },
    filter: function (event, player) {
					return event.player != player && player.countCards('h') <= player.maxHp
				},
    direct: true,
    content: function () {
					"step 0"
					event.cards = get.cards(3);
					player.chooseCardButton(1, '发掘：获得其中' + get.cnNumber(1) + '张牌', true, event.cards).set('ai', function (button) {
						return get.useful(button.link);
					});
					'step 1'
					var cards = result.links;
					player.gain(cards, 'draw');
					game.log(player, '发掘了', '#y' + get.translation(cards))
					event.cards.removeArray(cards);
					'step 2'
					while (event.cards.length) {
						ui.cardPile.insertBefore(event.cards.pop(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)])
					}
					"step 3"
					game.updateRoundNumber()
				},
    t: {
        name: "逢生",
        info: "当你成为其他角色使用牌的目标时，若你的手牌数不大于你的体力上限，你可「found」一张牌。",
    },
};
