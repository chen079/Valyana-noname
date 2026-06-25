import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init(player, skill) {
					player.addSkillBlocker(skill);
				},
    onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
    charlotte: true,
    locked: true,
    skillBlocker(skill, player) {
					var element = lib.skill[skill].linkage
					return element && ((player.name1 != 'vl_kulun_' + element) && (player.name2 != 'vl_kulun_' + element))
				},
    t: {
        name: "vl_kulun_skillfilter",
        info: "",
    },
};
