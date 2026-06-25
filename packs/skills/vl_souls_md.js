import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageBefore",
    },
    mark: true,
    intro: {
        content: "你本轮发动此技能的次数为：#",
    },
    init(player) {
					if (!player.storage.vl_souls_md) player.storage.vl_souls_md = 0
				},
    check(event, player) {
					return get.attitude(player, event.player) > 1 && !event.player.hasSkillTag('maixie') && event.num < event.player.hp
				},
    filter(event, player) {
					return player.Vp > 0 && player.storage.vl_souls_md + 1 <= player.Vp
				},
    async content(event, trigger, player) {
						await player.consumeVp(player.storage.vl_souls_md + 1)
						player.storage.vl_souls_md += 1
						trigger.cancel()
    },
    group: "vl_souls_md_round",
    subSkill: {
        round: {
            trigger: {
                global: "roundStart",
            },
            firstDo: true,
            direct: true,
            forced: true,
            charlotte: true,
            async content(event, trigger, player) {
							player.storage.vl_souls_md = 0
						},
        },
    },
    t: {
        name: "魔盾",
        info: "一名角色受到伤害时，你可以消耗X点魔力，然后取消此次伤害（X为本轮你发动此技能的次数+1）。 ",
    },
};
