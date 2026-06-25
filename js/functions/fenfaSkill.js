import { lib, game, ui, get, _status } from '../../../../noname.js'

export function fenfaSkill(skillname) {
    const info = lib.skill[skillname];
    if (!info?.fenfa) return;
    info.skillBlocker = function (skill, player) {
        const range = get.select(typeof info.fenfa == 'function' ? info.fenfa(player) : info.fenfa);
        if (range[0] == range[1]) return skill == skillname && player.hp != range[0];
        return skill == skillname && !(player.hp >= range[0] && player.hp <= range[1]);
    };
    info.onremove = function (player, skill) {
        player.removeSkillBlocker(skill);
    };
    this.addSkillBlocker(skillname);
};