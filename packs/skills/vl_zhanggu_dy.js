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
            cards.push(game.createCard2('du', i % 2 ? 'club' : 'spade', i));
        }
        game.broadcastAll(function () { lib.inpile.add('du') });
        game.cardsGotoPile(cards, () => {
            return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
        })
    },
    mod: {
        ignoredHandcard(card, player) {
            if (get.name(card) == 'du') return true;
        },
        cardDiscardable(card, player, name) {
            if (name == 'phaseDiscard' && get.name(card) == 'du') return false;
        },
    },
    group: "vl_zhanggu_dy_loseHp",
    subSkill: {
        loseHp: {
            trigger: {
                player: "loseHpBegin",
            },
            filter(event, player) {
                return event.type == 'du';
            },
            forced: true,
            async content(event, trigger, player) {
                trigger.cancel();
            },
            sub: true,
        },
    },
    t: {
        name: "毒医",
        info: `锁定技，①游戏开始时，你将8张${get.poptip("du")}加入牌堆，②你因【毒①】失去体力时，取消之，③你的【毒】不计入手牌上限。`,
    },
};
