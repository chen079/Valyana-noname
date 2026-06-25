import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: ["vl_kert_jl_1", "vl_kert_jl_2"],
    subSkill: {
        "1": {
            forced: true,
            mod: {
                ignoredHandcard(card, player) {
                    if (get.color(card) == 'black' && get.name(card) == 'sha') return true;
                },
                cardDiscardable(card, player, name) {
                    if (name == 'phaseDiscard' && get.color(card) == 'black' && get.name(card) == 'sha') return false;
                },
            },
            sub: true,
        },
        "2": {
            forced: true,
            mod: {
                cardUsable(card, player, num) {
                    if (card.name == 'sha') return num + 1;
                },
            },
            ai: {
                mapValue: 2,
            },
            sub: true,
        },
    },
    t: {
        name: "积虑",
        info: "锁定技，你的黑色【杀】不计入手牌上限，且你可以多使用一张杀。",
    },
};
