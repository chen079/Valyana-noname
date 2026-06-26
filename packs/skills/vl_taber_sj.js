import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    position: "he",
    filterCard(card, player, event) {
        event = event || _status.event;
        if (typeof event != 'string') event = event.getParent().name;
        let mod = game.checkMod(card, player, event, 'unchanged', 'cardDiscardable', player);
        if (mod != 'unchanged') return mod;
        return true;
    },
    discard: false,
    lose: false,
    delay: false,
    selectCard: [1, null],
    check(card) {
        let player = _status.event.player;
        if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
            return get.value(card) >= 8;
        }))) {
            return 1;
        }
        return 6 - get.value(card)
    },
    async content(event, trigger, player) {
        const cards = event.cards;
        event.gross = []
        player.discard(cards);
        event.num = 1;
        let hs = player.getCards('h');
        if (!hs.length) event.num = 0;
        for (let i = 0; i < hs.length; i++) {
            if (!cards.includes(hs[i])) {
                event.num = 0; break;
            }
        }
        event.count = event.num + cards.length
        while (event.count != 0) {
            event.cards = get.cards(3);
            const result = await player.chooseCardButton(1, '发掘：获得其中' + get.cnNumber(1) + '张牌', true, event.cards).set('ai', function (button) {
                return get.useful(button.link);
            }).forResult();
            let gained = result.links;
            player.gain(gained, 'draw');
            game.log(player, '发掘了', '#y' + get.translation(gained))
            event.cards.removeArray(gained);
            while (event.cards.length) {
                ui.cardPile.insertBefore(event.cards.pop(), ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)])
            }
            game.updateRoundNumber()
            event.count--
        }
    },
    ai: {
        order: 1,
        result: {
            player: 1,
        },
        threaten: 1.5,
    },
    t: {
        name: "掘金",
        info: `出牌阶段限一次，你可以弃置任意张牌并${get.poptip("found")}</a>等量的牌，若你在发动〖掘金〗时弃置了所有手牌，你额外发掘一张牌。`,
    },
};
