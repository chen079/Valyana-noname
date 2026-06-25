import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    firstDo: true,
    trigger: {
        player: "useCard1",
    },
    init(player) {
        player.fenfaSkill('vl_kesaya_ax')
    },
    fenfa(player) {
        return [-Infinity, player.maxHp - 1]
    },
    forced: true,
    filter(event, player) {
        return !event.audioed && event.card.name == 'sha' && player.countUsed('sha', true) > 1 && event.getParent().type == 'phase';
    },
    async content(event, trigger, player) {
        trigger.audioed = true;
    },
    mod: {
        cardUsable(card, player, num) {
            if (card.name == 'sha') return Infinity;
        },
    },
    ai: {
        directHit_ai: true,
        unequip: true,
        skillTagFilter(player, tag, arg) {
            if (!get.zhu(player, 'shouyue')) return false;
            if (arg && arg.name == 'sha') return true;
            return false;
        },
    },
    group: "vl_kesaya_ax_1",
    subSkill: {
        "1": {
            trigger: {
                player: "shaBegin",
            },
            forced: true,
            async content(event, trigger, player) {
                trigger.directHit = true;
            },
            sub: true,
        },
    },
    t: {
        name: "暗袭",
        info: `${get.poptip("fenfa")}(-∞, maxHp)，锁定技，你使用【杀】无次数限制，且不可被响应。`,
    },
};
