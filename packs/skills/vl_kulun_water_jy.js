import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterCard(card) {
        return get.type(card) != 'basic';
    },
    linkage: "nature",
    position: "hse",
    filter(event, player) {
        return player.hasCard(function (card) {
            return get.type(card) != 'basic';
        }, 'hes') && ((player.name1 == 'vl_kulun_nature') || (player.name2 == 'vl_kulun_nature'));;
    },
    viewAs: {
        name: "shuiyanqijunx",
    },
    prompt: "将一张非基本牌当水淹七军使用",
    check(card) { return 8 - get.value(card) },
    group: "luweiyan2",
    ai: {
        order: 9,
        result: {
            target(player, target) {
                if (target.countCards('e')) return -1;
                return 0;
            },
        },
        tag: {
            multitarget: 1,
            multineg: 1,
        },
    },
    _priority: 0,
    t: {
        name: "决堰",
        info: "连携-自然：出牌阶段限一次，你可以将一张非基本牌当【水攻】使用。",
    },
};
