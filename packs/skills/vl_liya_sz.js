import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    mod: {
        targetInRange(card, player, target) {
            return true;
        },
    },
    locked: false,
    frequent: true,
    filter(event, player) {
        return event.source && event.source.isIn() && event.source != player
    },
    check(event, player) {
        return get.attitude(player, event.source) < 0
    },
    async content(event, trigger, player) {
        trigger.source.addSkill('vl_liya_sz_far')
        trigger.source.markSkill('vl_liya_sz_far')
    },
    ai: {
        maixie_defend: true,
    },
    subSkill: {
        far: {
            trigger: {
                player: "recoverEnd",
            },
            forced: true,
            popup: false,
            charlotte: true,
            filter(event, player) {
                return event.num > 0;
            },
            async content(event, trigger, player) {
                player.removeSkill('vl_liya_sz_far');
            },
            mod: {
                cardname(card, player, name) {
                    if (lib.card[card.name].type == 'trick') return 'sha';
                },
                attackRange(player, num) {
                    return 0;
                },
                globalFrom(from, to, current) {
                    return current + game.countPlayer();
                },
            },
            ai: {
                effect: {
                    target(card, player, target, current) {
                        if (get.tag(card, 'respondSha') && current < 0) return 0.6
                    },
                },
                respondSha: true,
            },
            sub: true,
            mark: true,
            intro: {
                content: "攻击范围为0，计算与其他角色的距离+X，且你普通锦囊牌均视为【杀】",
            },
        },
    },
    t: {
        name: "闪转",
        info: "你使用牌无距离限制；当你受到伤害后，你可以令伤害来源的攻击距离始终为0，其计算与其他角色的距离+X（X为场上角色数）且其普通锦囊牌均视为【杀】，直到其回复体力。",
    },
};
