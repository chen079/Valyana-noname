import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
    },
    init(player) {
    },
    mark: true,
    intro: {
        content: "每轮开始时你将手牌调整至体力上限然后隐匿。",
    },
    forced: true,
    group: ["vl_jet_fy_show"],
    async content(event, trigger, player) {
        let num = player.maxHp - player.countCards('h')
        if (num > 0) {
            await player.draw(num)
        } else if (num < 0) {
            await player.chooseToDiscard(-num, 'h', true).forResult()
        }
        player.unmarkSkill('vl_jet_fy_mark')
        lib.skill.vl_jet_fy.hideCharacter(player, 0)
        if (player.name2) lib.skill.vl_jet_fy.hideCharacter(player, 1)
    },
    hideCharacter(player, num) {
        if (typeof player.hideCharacter == 'function') {
            player.hideCharacter(num)
            return
        }
        const name = player['name' + (num + 1)]
        if (!name) return
        const className = num == 0 ? 'unseen' : 'unseen2'
        if (player.classList.contains(className)) return
        player.classList.add(className)
        if (!Array.isArray(player.hiddenSkills)) player.hiddenSkills = []
        const skills = lib.character[name]?.[3] || []
        for (const skill of skills) {
            if (lib.skill[skill]?.hiddenSkill && !player.hiddenSkills.includes(skill)) {
                player.hiddenSkills.push(skill)
                if (player.hasSkill(skill)) player.removeSkill(skill)
            }
        }
    },
    subSkill: {
        show: {
            trigger: {
                player: "showCharacterAfter",
            },
            forced: true,
            charlotte: true,
            popup: false,
            silent: true,
            filter(event, player) {
                return event.toShow.includes('vl_jet') && player.getStorage('vl_jet_sl', false) == true;
            },
            async content(event, trigger, player) {
                if (!player.hasSkill('vl_jet_sl')) player.addSkill('vl_jet_sl');
                await lib.skill.vl_jet_sl.content(event, trigger, player);
            },
        },
    },
    t: {
        name: "拂衣",
        info: "锁定技，每轮开始时，你将手牌数调整至体力上限并隐匿。",
        taici: ["先整理，再退场。", "该藏的，就先藏好。"],
    },
};
