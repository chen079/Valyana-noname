import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseJieshuBegin",
    },
    silent: true,
    forced: true,
    async content(event, trigger, player) {
        let cards = [];
        let card1 = get.cardPile2(function (card) {
            return get.color(card, false) == 'red';
        });
        if (card1) cards.push(card1);
        let card2 = get.cardPile2(function (card) {
            return get.color(card, false) == 'black';
        });
        if (card2) cards.push(card2);
        if (cards.length) player.gain(cards, 'gain2');
    },
    popup: false,
    t: {
        name: "勇往",
        info: "锁定技，结束阶段，你从牌堆中获得一张红色牌与一张黑色牌。",
    },
};
