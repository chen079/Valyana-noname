import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    global: "vl_akain_fy_nature",
    trigger: {
        source: "damageBegin2",
    },
    forced: true,
    filter: function (event, player) {
					if (!event.player.storage.vl_akain_fy_nature) return false
					if (!event.nature) return false
					return event.player.storage.vl_akain_fy_nature != event.nature
				},
    content: function () {
					trigger.num++
				},
    subSkill: {
        nature: {
            trigger: {
                player: "damageBegin4",
            },
            direct: true,
            charlotte: true,
            forced: true,
            filter: function (event, player) {
							return event.nature
						},
            mark: true,
            intro: {
                content: "上次受到的属性伤害为$属性",
            },
            content: function () {
							player.markSkill('vl_akain_fy_nature')
							player.storage.vl_akain_fy_nature = trigger.nature
						},
        },
    },
    t: {
        name: "风云",
        info: "锁定技，当你造成属性伤害时，若与受伤角色上一次受到过的属性伤害的属性不同，伤害+1。",
    },
};
