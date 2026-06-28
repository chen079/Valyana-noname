import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	getLoseHpNum(player) {
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
		return ["sha", "juedou"].includes(event.card?.name)
	},
	async content(event, trigger, player) {
		const num = lib.skill.vl_yue_jd.getLoseHpNum(player);
		const choices = ["加伤", "摸牌"];
		choices.push("背水");
		const result = await player
			.chooseControl(...choices, "cancel2")
			.set("prompt", get.prompt("vl_yue_jd"))
			.set("prompt2", `选择一项：1.令此牌造成的伤害+1且不计入次数限制；2.摸2张牌然后体力上限+1；背水：失去${get.cnNumber(num)}点体力上限`)
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
		if (result.control == "背水") await player.loseMaxHp(num);
		if (result.control == "加伤" || result.control == "背水") {
			const map = trigger.customArgs;
			for (const target of trigger.targets || []) {
				const args = map[target.playerid] || (map[target.playerid] = {});
				args.extraDamage = (args.extraDamage || 0) + 1;
			}
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = player.getStat().card;
				const name = trigger.card.name;
				if (typeof stat[name] == "number") stat[name]--;
			}
		}
		if (result.control == "摸牌" || result.control == "背水") {
			await player.draw(2);
			if (player.maxHp < 10) await player.gainMaxHp();
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
				player.removeSkill("vl_yue_jd");
				player.addSkillLog("vl_yue_yh");
			},
			sub: true,
		},
	},
	t: {
		name: "决荡",
		info: `使命技。当你使用【杀】或【决斗】时，你可以选择一项：
		<br>1. 令此牌造成的伤害+1且不计入次数限制；
		<br>2. 摸两张牌然后体力上限+1（至多为10）；
		<br>背水：失去[2]点体力上限。
		<br>成功：本回合因你造成的伤害使一名角色进入濒死状态。将〖决荡〗中[]内数字改为1。
		<br>失败：进入濒死状态或本回合没有造成伤害。你失去〖决荡〗，获得〖遗恨〗。`,
        taici: ['剑道无回，月下问心。', '一念拔剑，万象皆寂。'],
    },
};
