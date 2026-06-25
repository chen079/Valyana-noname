import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    mark: true,
    intro: {
        content(event, player, storage) {
            return '当前[]内的数值为：' + player.storage.vl_hynea_cg
        },
    },
    mod: {
        cardUsable(card, player, num) {
            if (card.name == 'jiu') return Infinity;
        },
    },
    init(player, skill) {
        if (!player.storage.vl_hynea_cg) player.storage.vl_hynea_cg = 4
        player.addSkill('vl_hynea_jiu')
        player.addSkillBlocker(skill);
    },
    onremove(player, skill) {
        player.removeSkillBlocker(skill);
        player.removeSkill('vl_hynea_jiu')
    },
    skillBlocker(skill, player) {
        return skill == "vl_hynea_jiu" && player.hp < player.storage.vl_hynea_cg;
    },
    ai: {
        skillTagFilter(player) {
            if (!player.countCards('hs', { name: ['tao', 'shan'] })) return false;
        },
        save: true,
    },
    t: {
        name: "蹴功",
        info: "锁定技。你使用【酒】无次数限制；当你的体力值不小于[4]时，你的【闪】和【桃】均视为【酒】。",
    },
};
