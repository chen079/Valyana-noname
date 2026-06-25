import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    filter(event, player) {
        return event.nature == 'fire' || event.nature == 'thunder';
    },
    forced: true,
    async content(event, trigger, player) {
        trigger.cancel();
    },
    group: "vl_dragon_ly_1",
    subSkill: {
        "1": {
            trigger: {
                player: "damageEnd",
            },
            forced: true,
            filter(event, player) {
                return event.num > 0;
            },
            async content(event, trigger, player) {
                var cards = [];
                while (cards.length < trigger.num) {
                    var card = get.cardPile(function (card) {
                        return get.tag(card, 'damage') && !cards.includes(card)
                    });
                    if (card) cards.push(card);
                    else break;
                }
                if (cards.length) player.gain(cards, 'gain2').gaintag.add('vl_dragon_hn')
            },
            sub: true,
        },
    },
    ai: {
        nofire: true,
        maixie: true,
        nothunder: true,
        effect: {
            target(card, player, target, current) {
                if (get.tag(card, 'fireDamage')) return 'zerotarget';
                if (get.tag(card, 'thunderDamage')) return 'zerotarget';
                if (card.name == 'tiesuo') return 'zeroplayertarget';
            },
        },
    },
    t: {
        name: "龙裔",
        info: "锁定技，当你受到属性伤害时，你取消之；当你受到伤害后，你从牌堆获得X张伤害类的牌并标记为“魂怒”（X为此次伤害值）。",
    },
};
