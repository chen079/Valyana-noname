import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin1",
    },
    check(event, player) {
					return player.hp > 2 && event.player.hp > event.num && !event.player.hasSkillTag('filterDamage', null, {
						player: player,
						card: event.card,
					}) && get.attitude(player, event.player) < 0;
				},
    filter(event, player) {
					return event.player != player
				},
    content: async function content(event, trigger, player) {
					await player.loseHp()
					await player.draw(2)
					trigger.num = trigger.num * 2;
				},
    group: "vl_delta_sz_hf",
    subSkill: {
        hf: {
            trigger: {
                player: "damageBegin3",
            },
            check() {
							return true
						},
            content: async function content(event, trigger, player) {
							await player.loseHp()
							await player.draw(2)
							trigger.num = Math.floor(trigger.num / 2)
						},
            sub: true,
        },
    },
    t: {
        name: "瞬斩",
        info: "当你造成/受到伤害时，你可以失去1点体力并摸两张牌，然后令此伤害翻倍/减半（向下取整）。",
    },
};
