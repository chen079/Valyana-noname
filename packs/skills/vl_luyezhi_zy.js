import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    forced: true,
    filter: function (event, player) {
					return event.nature == 'fire'
				},
    content: function () {
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
            filter: function (event, player) {
							return event.nature == 'fire'
						},
            content: function () {
							player.draw()
						},
        },
    },
    t: {
        name: "灸烨",
        info: "锁定技，你受到火焰伤害时，你防止之并回复1点体力。一名角色受到火焰伤害后，你摸一张牌。",
    },
};
