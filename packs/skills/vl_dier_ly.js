import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["damageBegin3", "loseHpBegin"],
    },
    filter(event, player) {
					if (event.name == 'damage') {
						return event.nature
					} else {
						return true
					}
				},
    mod: {
        targetInRange(card, player, target, now) {
						return true
					},
    },
    forced: true,
    async content(event, trigger, player) {
					player.draw(trigger.num)
				},
    group: ["vl_dier_ly_draw"],
    subSkill: {
        draw: {
            trigger: {
                player: "phaseDrawBegin2",
            },
            charlotte: true,
            unique: true,
            supercharlotte: true,
            forced: true,
            async content(event, trigger, player) {
							trigger.num += Math.ceil(player.getDamagedHp() / 2)
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
        name: "龙翼",
        info: "锁定技，你使用牌无距离限制；当你受到属性伤害或失去体力时，你摸X张牌（X为此次伤害或失去体力的值）；摸牌阶段，你多摸Y张牌（Y为你已损体力值的一半并向上取整）。",
    },
};
