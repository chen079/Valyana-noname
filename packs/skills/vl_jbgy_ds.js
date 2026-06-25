import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: ["phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore"],
	},
	frequent: true,
	async content(event, trigger, player) {
		var str
		if (trigger.name == 'phaseJudge') {
			str = '判定阶段'
		} else if (trigger.name == 'phaseDraw') {
			str = '摸牌阶段'
		} else if (trigger.name == 'phaseUse') {
			str = '出牌阶段'
		} else if (trigger.name == 'phaseDiscard') {
			str = '弃牌阶段'
		}
		var list, skills = [];
		if (get.mode() == 'guozhan') {
			list = [];
			for (var i in lib.characterPack.mode_guozhan) list.push(i);
		}
		else if (_status.connectMode) list = get.charactersOL();
		else {
			list = [];
			for (var i in lib.character) {
				if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) continue;
				list.push(i);
			}
		}
		for (var i of list) {
			if (i.indexOf('gz_jun') == 0) continue;
			for (var j of lib.character[i][3]) {
				if (j == 'jbgy_sj') continue;
				var skill = lib.skill[j];
				if (!skill || skill.zhuSkill || skill.dutySkill) continue;
				if (skill.init || skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg)) continue;
				var info = lib.translate[j + '_info'];
				if (info && info.indexOf(str) != -1) skills.add(j);
			}
		}
		player.storage.jbgy_sj = skills
		if (player.isIn()) {
			if (!player.storage.jbgy_sj) lib.skill.jbgy_sj.initList(player);
			var list = player.storage.jbgy_sj.randomGets(3);
			if (!list.length) {
				return;
				return;
			}
			event.videoId = lib.status.videoId++;
			var func = function (skills, id) {
				var dialog = ui.create.dialog('forcebutton');
				dialog.videoId = id;
				dialog.add('授技：请选择你要获得的技能');
				for (var i = 0; i < skills.length; i++) {
					dialog.add('<div class="popup pointerdiv" style="width:80%;display:inline-block"><div class="skill">【' + get.translation(skills[i]) + '】</div><div>' + lib.translate[skills[i] + '_info'] + '</div></div>');
				}
				dialog.addText(' <br> ');
			}
			if (player.isOnline()) player.send(func, list, event.videoId);
			else if (player == game.me) func(list, event.videoId);
			var result = await player.chooseControl(list).forResult();
		}
		else return;
		game.broadcastAll('closeDialog', event.videoId);
		player.addTempSkill(result.control, trigger.name + 'End');
		player.popup(result.control);
		game.log(player, '获得了技能', '#g【' + get.translation(result.control) + '】');
	},
	ai: {
		threaten: 0.9,
	},
	t: {
		name: "登神",
		info: "你的判定/摸牌/出牌/弃牌阶段开始前，你可从三个描述中包含该阶段的技能中选择一个获得直到此阶段结束。",
	},
};
