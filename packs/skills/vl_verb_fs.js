import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToTargeted",
    },
    filter(event, player) {
					return event.player != player && player.countCards('h') <= player.maxHp
				},
    direct: true,
    async content(event, trigger, player) {
						const cards = get.cards(3);
						const result = await player.chooseCardButton(1, '发掘：获得其中' + get.cnNumber(1) + '张牌', true, cards).set('ai', function (button) {
							return get.useful(button.link);
						}).forResult();
						const gains = result.links;
						await player.gain(gains, 'draw');
						game.log(player, '发掘了', '#y' + get.translation(gains))
						cards.removeArray(gains);
						while (cards.length) {
							ui.cardPile.insertBefore(cards.pop(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)])
						}
						game.updateRoundNumber()
    },
    t: {
        name: "逢生",
        info: `当你成为其他角色使用牌的目标时，若你的手牌数不大于你的体力上限，你可${get.poptip("found")}一张牌。`,
    },
};
