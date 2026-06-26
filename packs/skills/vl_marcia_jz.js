import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    usable: 1,
    enable: "phaseUse",
    filter(event, player) {
        return player.countCards('h') > 0
    },
    init(player) {
        if (!player.storage.vl_marcia_jz_suit) player.storage.vl_marcia_jz_suit = [];
    },
    filterCard(card) {
        let suit = get.suit(card);
        for (let i = 0; i < ui.selected.cards.length; i++) {
            if (get.suit(ui.selected.cards[i]) == suit) return false;
        }
        return true;
    },
    complexCard: true,
    selectCard: [1, 4],
    check(card) {
        return 7 - get.value(card)
    },
    prompt2: "你可以弃置任意数量的牌，然后本回合若你使用的牌的花色与你弃置过的花色相同，此牌不可被响应。",
    mark: true,
    intro: {
        content(storage, player, skill) {
            if (player.storage.vl_marcia_jz_suit) { return "已记录花色：" + get.translation(player.storage.vl_marcia_jz_suit) }
        },
        onunmark: true,
    },
    async content(event, trigger, player) {
        const cards = event.cards;
        await player.draw(cards.length);
        for (let i = 0; i < cards.length; i++) {
            if (!player.storage.vl_marcia_jz_suit.includes(get.suit(cards[i]))) {
                player.storage.vl_marcia_jz_suit.push(get.suit(cards[i]));
            }
        }
        player.addTempSkill("vl_marcia_jz_1");
    },
    ai: {
        order: 7,
        result: {
            player: 1,
        },
    },
    group: "vl_marcia_jz_remove",
    subSkill: {
        "1": {
            trigger: {
                player: "useCard",
            },
            forced: true,
            filter(event, player) {
                return event.card.name == 'sha' && player.storage.vl_marcia_jz_suit.includes(get.suit(event.card));
            },
            async content(event, trigger, player) {
                trigger.directHit.addArray(game.players)
            },
            mod: {
                wuxieRespondable(card, player) {
                    if (player.storage.vl_marcia_jz_suit.includes(get.suit(card))) return false;
                },
            },
            sub: true,
        },
        suit: {
            sub: true,
        },
        remove: {
            forced: true,
            popup: false,
            trigger: {
                player: "phaseAfter",
            },
            async content(event, trigger, player) {
                player.storage.vl_marcia_jz_suit = []
            },
            sub: true,
        },
    },
    t: {
        name: "谨战",
        info: "出牌阶段限一次，你可以弃置任意张花色不同的手牌，并记录这些花色，然后摸等量的牌；本回合内若你使用牌的花色已被记录，此牌不可被响应；回合结束时，你清除所有记录。",
    },
};
