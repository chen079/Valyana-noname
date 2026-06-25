import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    filter(event, player) {
					return event.player.countMark('vl_jiejie_zr_1') > 2;
				},
    trigger: {
        global: "phaseBefore",
    },
    async content(event, trigger, player) {
					trigger.player.removeMark('vl_jiejie_zr_1', trigger.player.countMark("vl_jiejie_zr_1"))
					trigger.player.removeSkill('vl_jiejie_zr_2')
					trigger.player.loseHp(3)
					player.loseMaxHp(2)
					if (player.isCharacter('vl_jiejie')) {
					}
				},
    t: {
        name: "断破",
        info: "锁定技，其他角色回合开始时，若其“势”标记不少于3枚。则移去所有“势”标记，然后该角色失去3点体力，你减2点体力上限。",
    },
};
