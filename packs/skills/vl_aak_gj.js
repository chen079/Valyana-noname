import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    forced: true,
    content: function () {
					player.loseHp()
				},
    group: "vl_aak_gj_1",
    subSkill: {
        "1": {
            trigger: {
                player: "recoverBefore",
            },
            forced: true,
            content: function () {
							trigger.num += 1
						},
        },
    },
    t: {
        name: "怪杰",
        info: "锁定技，回合开始时，你失去一体力；你受到的回复效果+1。",
    },
};
