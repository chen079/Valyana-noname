import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseBegin",
	},
	unique: true,
	filter(event, player) {
		return player.getSubPlayers('vl_wore_hy_get').length > 0 && !player.hasSkill('subplayer');
	},
	locked: true,
	charlotte: true,
	async content(event, trigger, player) {
		await player.callSubPlayer()
	},
	group: ["vl_wore_hy_get"],
	ai: {
		order: 1,
		result: {
			player(player, target) {
				return 1;
				// if(player.hp<=3) return 3;
				// if(!player.needsToDiscard(player.hp-1)) return 2;
				// return 1;
			},
		},
	},
	subSkill: {
		get: {
			trigger: {
				player: "damageAfter",
				global: "roundStart",
			},
			forced: true,
			filter(event, player) {
				if (event.name == 'damage') {
					return event.num > 0
				} else {
					return game.roundNumber == 1
				}
			},
			async content(event, trigger, player) {
				let list = [];
				for (const i in lib.character) {
					if (!lib.filter.characterDisabled(i) && !lib.filter.characterDisabled2(i)) {
						list.push(i);
					}
				}
				const BanList = ['vl_wore', 'vl_ken', 'vl_hars']
				list.removeArray(BanList);
				list = list.randomGets(4)
				const dialog = ui.create.dialog('请选择随从的技能', 'hidden');
				dialog.add([list.randomGets(list.length), 'character']);
				const chooseEvent = player.chooseButton(dialog, true).set('ai', function (button) {
					return get.rank(button.link, true);
				});
				lib.skill.subplayer_maxHand = {
					mod: {
						maxHandcardBase: function (player, num) {
							return 3;
						},
					},
				}
				const result = await chooseEvent.forResult();
				const skills = lib.character[result.links[0]][3]
				skills.push('subplayer_maxHand')
				const name1 = player.addSubPlayer({
					name: result.links[0],
					skills: skills,
					hp: 1,
					hujia: 0,
					maxHp: 1,
					sex: lib.character[result.links[0]][0],
					hs: get.cards(4),
				});
				const name2 = player.getStorage(name1, {}).name
				lib.character[name1][4] = [get.avatarPath(name2)]
				await player.callSubPlayer()
			},
			sub: true,
		},
	},
	t: {
		name: "惑言",
		info: "锁定技，首轮游戏开始时，或当你受到伤害结算完毕后，你获得并切换至随从“催眠者”（体力上限为1，初始手牌为4，手牌上限为3，催眠者从三个随机武将中获得其中一个武将的技能，死亡时切回本体）。",
	},
};
