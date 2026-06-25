import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    init(player) {
					if (!player.storage.vl_death_sp) player.storage.vl_death_sp = false
				},
    forced: true,
    filter(event, player) {
					var num = 0;
					for (var j = 0; j < player.stat.length; j++) {
						if (player.stat[j].damage != undefined) num += player.stat[j].damage;
					}
					return num >= 6
				},
    juexingji: true,
    skillAnimation: true,
    mark: true,
    intro: {
        mark(dialog, storage, player) {
						var num = 0;
						if (player.stat) {
							for (var j = 0; j < player.stat.length; j++) {
								if (player.stat[j].damage != undefined) num += player.stat[j].damage;
							}
						}
						dialog.addText('已累计造成' + get.cnNumber(num) + '点伤害')
					},
    },
    async content(event, trigger, player) {
					player.loseMaxHp()
					player.awakenSkill('vl_death_sp')
					player.storage.vl_death_sp = true
				},
    t: {
        name: "审判",
        info: `觉醒技，当你累计造成不少于6点伤害时，你失去1点体力上限并修改${get.poptip("vl_death_sl")}①为：每回合限一次，当你对其他角色造成伤害时，你可以令此伤害+1并获得该角色的一张牌。`,
    },
};
