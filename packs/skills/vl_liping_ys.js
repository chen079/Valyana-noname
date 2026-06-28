import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBefore",
        player: "enterGame",
    },
    forced: true,
    filter(event, player) {
        return (event.name != 'phase' || game.phaseNumber == 0);
    },
    async content(event, trigger, player) {
        let cards = [];
        for (let i = 2; i < 10; i++) {
            cards.push(game.createCard2('tao', i % 2 ? 'club' : 'spade', i));
        }
        game.broadcastAll(function () { lib.inpile.add('tao') });
        game.cardsGotoPile(cards, () => {
            return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
        })
    },
    mod: {
        ignoredHandcard(card, player) {
            if (get.name(card) == 'tao') return true;
        },
        cardDiscardable(card, player, name) {
            if (name == 'phaseDiscard' && get.name(card) == 'tao') return false;
        },
    },
    group: "vl_liping_ys_recover",
    subSkill: {
        recover: {
            trigger: {
                player: "taoBegin",
            },
            forced: true,
            async content(event, trigger, player) {
                trigger.baseDamage++;
            },
            sub: true,
        },
    },
    t: {
        name: "医圣",
        info: "锁定技，①游戏开始时，你将8张【桃】加入牌堆，②你的【桃】回复量+1且不计入手牌上限。",
        taici: ['以石为誓，以身为城。', '谁敢越界，先问山岳。'],
    },
};
