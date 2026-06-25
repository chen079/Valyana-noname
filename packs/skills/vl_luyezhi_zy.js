import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    forced: true,
    filter(event, player) {
					return event.nature == 'fire'
				},
    async content(event, trigger, player) {
					trigger.cancel()
					player.recover()
				},
    group: "vl_luyezhi_zy_draw",
    subSkill: {
        draw: {
            trigger: {
                global: "damageEnd",
            },
            forced: true,
            filter(event, player) {
							return event.nature == 'fire'
						},
            async content(event, trigger, player) {
							player.draw()
						},
        },
    },
    t: {
        name: "灸烨",
        info: "锁定技，你受到火焰伤害时，你防止之并回复1点体力。一名角色受到火焰伤害后，你摸一张牌。",
    },
};
