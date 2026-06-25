import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        global: "dieAfter",
    },
    filter: function (event, player, card) {
					return event.player.countMark("vl_jiejie_zr_1") > 0
				},
    content: function () {
					player.loseMaxHp(trigger.player.countMark("vl_jiejie_zr_1"))
					trigger.player.removeMark('vl_jiejie_zr_1', trigger.player.countMark('vl_jiejie_zr_1'))
				},
    group: "vl_jiejie_my_1",
    subSkill: {
        "1": {
            forced: true,
            trigger: {
                global: "phaseBegin",
            },
            filter: function (event, player, card) {
							return event.player.countMark("vl_jiejie_zr_1") > 0
						},
            content: function () {
							player.draw(trigger.player.countMark("vl_jiejie_zr_1"))
						},
            sub: true,
        },
    },
    t: {
        name: "剑合",
        info: "锁定技，当拥有“势”标记的角色的回合开始时，你摸X张牌。当拥有“势”标记的角色死亡后，你失去X点体力上限（X为其拥有的“势”标记数量）。",
    },
};
