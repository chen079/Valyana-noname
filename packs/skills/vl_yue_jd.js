import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	getDiscardNum(player) {
		return player.getStorage("vl_yue_jd_achieved", false) ? 1 : 2;
	},
	trigger: {
		player: "useCard",
	},
	direct: true,
	unique: true,
	dutySkill: true,
	derivation: "vl_yue_yh",
	filter(event, player) {
		return ["sha", "juedou"].includes(event.card?.name) && player.countCards("he") >= lib.skill.vl_yue_jd.getDiscardNum(player);
	},
	async content(event, trigger, player) {
		const num = lib.skill.vl_yue_jd.getDiscardNum(player);
		const canBackwater = player.countCards("he") >= num;
		const choices = ["加伤", "摸牌"];
		if (canBackwater) choices.push("背水");
		const result = await player
			.chooseControl(...choices, "cancel2")
			.set("prompt", get.prompt("vl_yue_jd"))
			.set("prompt2", `选择一项：1.令此牌造成的伤害+1且不计入次数限制；2.摸X张牌然后体力上限+1（X为你的已损体力值）；背水（需弃置${get.cnNumber(num)}张牌）：同时执行前两项。`)
			.set("ai", () => {
				const player = _status.event.player;
				if (player.countCards("he") < num) return player.getDamagedHp() >= 2 ? "摸牌" : "加伤";
				if (player.getDamagedHp() >= 2 && player.maxHp <= 2) return "背水";
				if (player.getDamagedHp() >= 2) return "摸牌";
				if (player.maxHp <= 2) return "加伤";
				return "背水";
			})
			.forResult();
		if (!["加伤", "摸牌", "背水"].includes(result.control)) return;
		player.logSkill("vl_yue_jd");
		if (result.control == "背水") await player.chooseToDiscard("he", num, true);
		if (result.control == "加伤" || result.control == "背水") {
			const evt = trigger.getParent();
			evt.customArgs ??= {};
			for (const target of trigger.targets || []) {
				const args = evt.customArgs[target.playerid] || (evt.customArgs[target.playerid] = {});
				args.extraDamage = (args.extraDamage || 0) + 1;
			}
			trigger.addCount = false;
		}
		if (result.control == "摸牌" || result.control == "背水") {
			const damaged = player.getDamagedHp();
			if (damaged > 0) await player.draw(damaged);
			await player.gainMaxHp();
		}
	},
	group: ["vl_yue_jd_record", "vl_yue_jd_achieve", "vl_yue_jd_fail_dying", "vl_yue_jd_fail_phase"],
	subSkill: {
		init: {
			trigger: {
				player: "phaseBegin",
			},
			forced: true,
			popup: false,
			charlotte: true,
			content(event, trigger, player) {
				player.setStorage("vl_yue_jd_damaged", false);
			},
			sub: true,
		},
		record: {
			trigger: {
				source: "damageEnd",
			},
			forced: true,
			popup: false,
			charlotte: true,
			filter(event, player) {
				return _status.currentPhase == player && event.num > 0;
			},
			content(event, trigger, player) {
				player.setStorage("vl_yue_jd_damaged", true);
			},
			sub: true,
		},
		damaged: {
			charlotte: true,
			sub: true,
		},
		achieve: {
			trigger: {
				source: "dying",
			},
			forced: true,
			skillAnimation: true,
			animationColor: "fire",
			filter(event, player) {
				return _status.currentPhase == player && !player.getStorage("vl_yue_jd_achieved", false);
			},
			content(event, trigger, player) {
				game.log(player, "成功完成使命");
				player.setStorage("vl_yue_jd_achieved", true);
				player.awakenSkill("vl_yue_jd");
			},
			sub: true,
		},
		fail_dying: {
			trigger: {
				player: "dying",
			},
			forced: true,
			filter(event, player) {
				return !player.getStorage("vl_yue_jd_achieved", false);
			},
			content(event, trigger, player) {
				game.log(player, "使命失败");
				player.awakenSkill("vl_yue_jd");
				player.removeSkill("vl_yue_jd");
				player.addSkillLog("vl_yue_yh");
			},
			sub: true,
		},
		fail_phase: {
			trigger: {
				player: "phaseEnd",
			},
			forced: true,
			filter(event, player) {
				return !player.getStorage("vl_yue_jd_achieved", false) && !player.getStorage("vl_yue_jd_damaged", false);
			},
			content(event, trigger, player) {
				game.log(player, "使命失败");
				player.awakenSkill("vl_yue_jd");
				player.removeSkill("vl_yue_jd");
				player.addSkillLog("vl_yue_yh");
			},
			sub: true,
		},
	},
	t: {
		name: "决荡",
		info: `使命技。当你使用【杀】或【决斗】时，你可以选择一项：
		<br>1.令此牌造成的伤害+1且不计入次数限制；
		<br>2.摸X张牌然后体力上限+1（X为你的已损体力值）；
		<br>背水：弃置[2]张牌。
		<br>成功：本回合因你造成的伤害使一名角色进入濒死状态。将〖决荡〗中[]内数字改为1。
		<br>失败：进入濒死状态或本回合没有造成伤害。你失去〖决荡〗，获得〖遗恨〗。`,
	},
};
