import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
	source: "damageSource",
	},
	init(player) {
		if (!player.hasStorage('vl_hundun_sp')) player.setStorage('vl_hundun_sp', false)
	},
	forced: true,
	filter(event, player) {
		let num = 0;
		for (let j = 0; j < player.stat.length; j++) {
			if (player.stat[j].damage != undefined) num += player.stat[j].damage;
		}
		return num >= 6
	},
	juexingji: true,
	skillAnimation: true,
	mark: true,
	intro: {
		mark(dialog, storage, player) {
			let num = 0;
			if (player.stat) {
				for (let j = 0; j < player.stat.length; j++) {
					if (player.stat[j].damage != undefined) num += player.stat[j].damage;
				}
			}
			dialog.addText('已累计造成' + get.cnNumber(num) + '点伤害')
		},
	},
	async content(event, trigger, player) {
		player.loseMaxHp()
		player.awakenSkill('vl_hundun_sp')
		player.setStorage('vl_hundun_sp', true)
	},
	t: {
		name: "审判",
		info: `觉醒技，当你累计造成不少于6点伤害时，你失去1点体力上限并修改${get.poptip("vl_hundun_sl")}①为：每回合限一次，当你对其他角色造成伤害时，你可以令此伤害+1并获得该角色的一张牌。`,
        taici: ['生死无门，惟我掌钥。', '幽冥深处，也要向我回声。'],
    },
};
