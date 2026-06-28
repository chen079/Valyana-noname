import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	filterCard(card) {
		if (ui.selected.cards.length) {
			return get.color(card) != get.color(ui.selected.cards[0]) && get.number(card) == get.number(ui.selected.cards[0])
		} else {
			return true
		}
	},
	limited: true,
	mark: true,
	intro: {
		content: "limited",
	},
	animationColor: "thunder",
	skillAnimation: "epic",
	complexCard: true,
	selectCard: 2,
	check(card) {
		return 7 - get.value(card)
	},
	filter(event, player) {
		let list = [];
		for (let i = 0; i < game.dead.length; i++) {
			if (game.dead[i].maxHp != 0) {
				list.push(game.dead[i].name);
			}
		}
		return list.length > 0;
	},
	async content(event, trigger, player) {
		player.awakenSkill('vl_nanci_tx')
		let list = [];
		for (let i = 0; i < game.dead.length; i++) {
			if (game.dead[i].maxHp != 0) {
				list.push(game.dead[i].name);
			}
		}
		const result = await player.chooseButton(ui.create.dialog('选择一名已死亡的角色令其复活', [list, 'character']), function (button) {
			let player = _status.event.player
			for (let i = 0; i < game.dead.length; i++) {
				if (game.dead[i].name == button.link) {
					let dead = game.dead[i];
					return get.attitude(player, dead)
				}
			}
		}).forResult();
		if (result.bool) {
			for (let i = 0; i < game.dead.length && game.dead[i].name != result.buttons[0].link; i++);
			let dead = game.dead[i];
			dead.revive(1);
			dead.changeHujia(1, null, true);
			player.changeHujia(1, null, true);
			let skills = dead.getSkills();
			for (let j = 0; j < skills.length; j++) {
				dead.markSkill(skills[j])
			}
			dead.checkMarks()
			dead.addTempSkill('vl_nanci_tx_gain')
			dead.setStorage('vl_nanci_tx_gain', player)
		}
	},
	subSkill: {
		gain: {
			mark: true,
			trigger: {
				global: "phaseEnd",
			},
			forced: true,
			intro: {
				mark(dialog, storage, player) {
					dialog.addText('回合结束时，将手牌摸至与' + get.translation(player.getStorage('vl_nanci_tx_gain', null)) + '相同')
				},
			},
			filter(event, player) {
				const target = player.getStorage('vl_nanci_tx_gain', null);
				return event.player == target && target && target.isIn()
			},
			content(player) {
				const target = player.getStorage('vl_nanci_tx_gain', null);
				if (!target) return;
				let num = target.countCards('h') - player.countCards('h')
				if (num > 0) {
					player.draw(num)
				}
				player.setStorage('vl_nanci_tx_gain', null)
			},
		},
	},
	ai: {
		order: 3,
		result: {
			player(card, player) {
				let list = [];
				for (let i = 0; i < game.dead.length; i++) {
					if (game.dead[i].maxHp != 0) {
						list.push(game.dead[i].name);
					}
				}
				for (let i in list) {
					if (get.attitude(player, i) > 0) return 1
				}
			},
		},
	},
	t: {
		name: "天选",
		info: "限定技，出牌阶段，你可以弃置两张颜色不同且点数相同的牌并选择一名已死亡的角色，将其复活至1点体力并获得1点护甲。回合结束时，该角色将手牌摸至与你相同。",
	},
};
