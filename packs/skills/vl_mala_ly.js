import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    filter: function (event, player) {
					return event.nature
				},
    forced: true,
    content: function () {
					trigger.cancel();
					player.draw(trigger.num)
				},
    group: ["vl_mala_ly_draw", "vl_mala_ly_hp"],
    subSkill: {
        hp: {
            trigger: {
                player: "loseHpBegin",
            },
            forced: true,
            content: function () {
							trigger.cancel();
							player.draw(trigger.num)
						},
            sub: true,
        },
        draw: {
            trigger: {
                player: "phaseDrawBegin2",
            },
            forced: true,
            content: function () {
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
            target: function (card, player, target, current) {
							if (get.tag(card, 'fireDamage')) return 'zerotarget';
							if (get.tag(card, 'thunderDamage')) return 'zerotarget';
							if (card.name == 'tiesuo') return 'zeroplayertarget';
						},
        },
    },
    t: {
        name: "龙脉",
        info: "锁定技，当你受到属性伤害或失去体力时，你取消之并摸X张牌（X为此次伤害或失去体力的值）；摸牌阶段，你多摸Y张牌（Y为你已损体力值的一半，向上取整）。",
    },
};
