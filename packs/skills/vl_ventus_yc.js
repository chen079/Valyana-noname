import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToBegin",
    },
    direct: true,
    filter(event, player) {
        return event.card.name == 'sha' && event.target != player && event.target
    },
    async content(event, trigger, player) {
        trigger.target.loseHp()
    },
    group: "vl_ventus_yc_draw",
    subSkill: {
        draw: {
            trigger: {
                player: "phaseDrawBegin1",
            },
            direct: true,
            async content(event, trigger, player) {
                let card1 = get.cardPile2(function (card) {
                    return get.name(card, false) == 'sha';
                });
                player.gain(card1, 'gain2')
            },
            sub: true,
        },
    },
    t: {
        name: "勇刺",
        info: "摸牌阶段，你额外从牌堆中获得一张【杀】；你使用【杀】指定一名其他角色为目标时，该角色失去1点体力。",
    },
};
