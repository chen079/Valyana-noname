import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	canChooseSkill(info, skill) {
		return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique;
	},
	trigger: {
		target: "useCardToTargeted",
		global: "phaseEnd",
	},
	direct: true,
	priority: 1,
	filter(event, player, name) {
		if (name == "useCardToTargeted") return true;
		if (!player.getStorage('vl_ranxing_sy_targeted', false)) return false;
		if (event.player == player) return false;
		return true;
	},
	async content(event, trigger, player) {
		if (event.triggername == "useCardToTargeted") {
			player.setStorage('vl_ranxing_sy_targeted', true);
			return;
		}
		player.setStorage('vl_ranxing_sy_targeted', false);
		if (!trigger.player?.isAlive()) return;
		const list = get.gainableSkillsName(trigger.player.name, lib.skill.vl_ranxing_sy.canChooseSkill);
		if (!list.length) return;
		const result = await player.chooseControl(list, 'cancel2').set('prompt', get.prompt('vl_ranxing_sy', trigger.player)).set('prompt2', '选择其一个非限定、非觉醒、非使命、非主公技的技能，或点击取消').set('ai', function () {
			return _status.event.list.randomGet();
		}).set('list', list).forResult();
		if (result.control == 'cancel2') return;
		const skill = result.control;
		if (!trigger.player.hasStorage('vl_ranxing_sy_blocker')) trigger.player.setStorage('vl_ranxing_sy_blocker', []);
		trigger.player.getStorage('vl_ranxing_sy_blocker', []).add(skill);
		trigger.player.addSkill('vl_ranxing_sy_blocker');
		player.logSkill('vl_ranxing_sy', trigger.player);
		player.addSkill(skill);
		player.popup(skill);
		game.log(player, '获得技能', '【' + get.translation(skill) + '】');
		if (!player.hasStorage('vl_ranxing_sy_gain')) player.setStorage('vl_ranxing_sy_gain', []);
		player.getStorage('vl_ranxing_sy_gain', []).push([trigger.player, skill, true]);
		player.addSkill('vl_ranxing_sy_clear');
	},
	onremove(player) {
		const storage = player.getStorage('vl_ranxing_sy_gain', []);
		for (const item of storage) {
			const source = item[0], skill = item[1];
			if (player.hasSkill(skill)) player.removeSkill(skill);
			if (source?.hasStorage?.('vl_ranxing_sy_blocker')) {
				source.getStorage('vl_ranxing_sy_blocker', []).remove(skill);
				if (!source.getStorage('vl_ranxing_sy_blocker', []).length) source.removeSkill('vl_ranxing_sy_blocker');
			}
		}
		player.setStorage('vl_ranxing_sy_gain', []);
		player.setStorage('vl_ranxing_sy_targeted', false);
	},
	subSkill: {
		blocker: {
			init(player, skill) {
				player.addSkillBlocker(skill);
			},
			onremove(player, skill) {
				player.removeSkillBlocker(skill);
				player.setStorage('vl_ranxing_sy_blocker', []);
			},
			charlotte: true,
			skillBlocker(skill, player) {
				return player.getStorage('vl_ranxing_sy_blocker', []).includes(skill);
			},
			mark: true,
			intro: {
				content(storage, player, skill) {
					const list = player.getSkills(null, false, false).filter(function (i) {
						return lib.skill.vl_ranxing_sy_blocker.skillBlocker(i, player);
					});
					if (list.length) return '失效技能：' + get.translation(list);
					return '无失效技能';
				},
			},
		},
		clear: {
			trigger: {
				global: ["phaseEnd", "die"],
			},
			priority: 10,
			forced: true,
			popup: false,
			charlotte: true,
			forceDie: true,
			filter(event, player) {
				if (!player.getStorage('vl_ranxing_sy_gain', []).length) return false;
				return player.getStorage('vl_ranxing_sy_gain', []).some(function (item) {
					return event.player == item[0];
				});
			},
			async content(event, trigger, player) {
				const storage = player.getStorage('vl_ranxing_sy_gain', []);
				for (let i = storage.length - 1; i >= 0; i--) {
					const source = storage[i][0], skill = storage[i][1];
					if (trigger.player != source) continue;
					if (trigger.name == 'phase' && storage[i][2]) {
						storage[i][2] = false;
						continue;
					}
					if (player.hasSkill(skill)) player.removeSkill(skill);
					if (source.hasStorage('vl_ranxing_sy_blocker')) source.getStorage('vl_ranxing_sy_blocker', []).remove(skill);
					if (!source.getStorage('vl_ranxing_sy_blocker', []).length) source.removeSkill('vl_ranxing_sy_blocker');
					storage.splice(i, 1);
				}
				if (!storage.length) player.removeSkill('vl_ranxing_sy_clear');
			},
		},
	},
	t: {
		name: "噬业",
		info: "<b>锁定技</b>，你成为过一张牌的目标的回合结束时，你可以选择当前回合角色的一个非限定、非觉醒、非使命、非主公技的技能。其该技能于其下回合结束前失效，你获得该技能直至其下回合结束或其死亡。",
        taici: ['星焰入血，战意燎原。', '让这片战场，记住我的光。'],
    },
};
