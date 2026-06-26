import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "die",
	},
	filter(event, player) {
		return event.player.getStockSkills().filter(function (skill) {
			let info = get.info(skill);
			return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
		}).length > 0;
	},
	logTarget: "player",
	direct: true,
	async content(event, trigger, player) {
		let list = trigger.player.getStockSkills().filter(function (skill) {
			let info = get.info(skill);
			return info && !info.juexingji && !info.hiddenSkill && !info.zhuSkill && !info.charlotte && !info.limited && !info.dutySkill;
		});
		const result = list.length == 1 ? { control: list[0] } : await player.chooseControl(list, 'cancel2').set('prompt', '选择获得' + get.translation(trigger.player) + '的一个技能').set('forceDie', true).set('ai', function () {
			return list.randomGet();
		}).forResult();
		if (result.control != 'cancel2') {
			player.addSkillLog(result.control);
			game.broadcastAll(function (skill) {
				let list = [skill]; game.expandSkills(list);
				for (let i of list) {
					let info = lib.skill[i];
					if (!info) continue;
				}
			}, result.control);
		} else {
			return
		}
		if (trigger.source == player) {
			await player.gainMaxHp()
			await player.recover()
		}
	},
	t: {
		name: "餮魂",
		info: "一名角色死亡时，你可以选择获得其的一个非特殊技能，若该角色是你杀死的，你增加1点体力上限并回复1点体力。",
	},
};
