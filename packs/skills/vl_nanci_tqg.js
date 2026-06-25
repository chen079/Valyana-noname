import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBegin",
    },
    frequent: true,
    async content(event, trigger, player) {
        const cards = get.cards(2);
        const result = await player.chooseButton(['天启：选择获得一张红色牌，或从牌堆底摸一张牌。', cards.slice(0)], 1).set('ai', function (button) {
            return get.value(button.link, _status.event.player);
        }).set('filterButton', function (button) {
            return get.color(button.link) == 'red';
        }).forResult();
        while (cards.length) {
            ui.cardPile.insertBefore(cards.pop(), ui.cardPile.firstChild);
        }
        if (result.bool) {
            await player.gain(result.links, 'gain2');
        } else {
            await player.draw('bottom');
        }
    },
    t: {
        name: "天启",
        info: "每名角色的回合开始时，你观看牌堆顶的两张牌并选择一项： <li>1.若其中有红色牌，你获得其中一张红色牌。<li>2.从牌堆底摸一张牌。",
    },
};
