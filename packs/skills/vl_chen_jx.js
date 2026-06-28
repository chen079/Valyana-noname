import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    getWeaponRange(card, player) {
        if (!card) return 0;
        const info = get.info(card);
        if (info && info.distance) {
            if (typeof info.distance.attackRange == 'function') return info.distance.attackRange(card, player);
            if (typeof info.distance.attackFrom == 'number') return 1 - info.distance.attackFrom;
        }
        return 1;
    },
    group: ["vl_chen_jx_fengyin", "vl_chen_jx_draw"],
    forced: true,
    mod: {
        cardUsable(card, player, num) {
            if (card.name != 'sha') return;
            const weapon = player.getEquip(1);
            if (!weapon) return;
            return num + lib.skill.vl_chen_jx.getWeaponRange(weapon, player);
        },
    },
    filter(event, player) {
        return false;
    },
    subSkill: {
        fengyin: {
            trigger: {
                player: "useCardToPlayered",
            },
            priority: 10,
            forced: true,
            shaRelated: true,
            filter(event, player) {
                return event.card.name == 'sha' && event.target.getAttackRange() < player.getAttackRange();
            },
            logTarget: "target",
            async content(event, trigger, player) {
                trigger.target.addTempSkill('fengyin');
            },
            ai: {
                ignoreSkill: true,
                skillTagFilter(player, tag, arg) {
                    if (!arg || !arg.card || arg.card.name != 'sha') return false;
                    if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || lib.skill[arg.skill].persevereSkill || get.is.locked(arg.skill, arg.target) || !arg.target.getSkills(true, false).includes(arg.skill)) return false;
                    return arg.target.getAttackRange() < player.getAttackRange();
                },
            },
            sub: true,
        },
        draw: {
            trigger: {
                global: ["loseEnd", "cardsDiscardEnd"],
            },
            forced: true,
            filter(event, player) {
                if (event.name == 'lose' && event.position != ui.discardPile) return false;
                return event.cards && event.cards.some(card => get.subtype(card) == 'equip1' && get.position(card, true) == 'd');
            },
            async content(event, trigger, player) {
                const num = trigger.cards.filter(card => get.subtype(card) == 'equip1' && get.position(card, true) == 'd').length;
                if (num > 0) await player.draw(2 * num);
            },
            sub: true,
        },
    },
    t: {
        name: "惊弦",
        info: "锁定技，若你的装备区有武器牌，你每回合使用【杀】的次数上限+X(X为该武器牌攻击范围)。当你使用【杀】指定的角色攻击范围小于你，该角色非锁定技失效。每有一张武器牌进入弃牌堆，你摸两张牌。",
        taici: ['星轨交错，我踏光而行。', '辰辉一闪，万象皆惊。'],
    },
};
