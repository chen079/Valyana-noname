import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	getLostCount(player) {
		return Math.min(7, Math.max(0, player.getDamagedHp()));
	},
	async useQibuCards(player) {
		const cards = player.getStorage("vl_yue_qibu_cards") || [];
		for (const card of cards) {
			if (player.canUse(card, player, false)) {
				await player.chooseUseTarget(card, true, "nopopup");
			}
		}
		player.setStorage("vl_yue_qibu_cards", []);
		player.setStorage("vl_yue_qibu_record", false);
	},
	init(player) {
		if (!player.getStorage("vl_yue_qibu_cards", null)) player.setStorage("vl_yue_qibu_cards", []);
		if (!player.getStorage("vl_yue_qibu_record", null)) player.setStorage("vl_yue_qibu_record", false);
	},
	trigger: {
		player: ["useCardToPlayered", "damageBegin3"],
	},
	direct: true,
	filter(event, player) {
		if (!event.card) return false;
		if (event.name == "damageBegin3") return true;
		return get.tag(event.card, "damage") && get.type(event.card) != "delay";
	},
	async content(event, trigger, player) {
		const lost = lib.skill.vl_yue_qibu.getLostCount(player);
		if (!lost) return;
		const result = await player
			.chooseTarget(get.prompt2("vl_yue_qibu"), true)
			.set("ai", target => {
				const att = get.attitude(_status.event.player, target);
				return target == _status.event.player ? att : -att;
			})
			.forResult();
		if (!result.bool) return;
		const target = result.targets[0];
		const useDamageCard = event.name == "useCardToPlayered";
		player.setStorage("vl_yue_qibu_record", true);
		let suitSet = new Set();
		const others = game.filterPlayer(current => current != (target || player)).sortBySeat();
		if (target != player) {
			for (const current of game.filterPlayer(current => current != player && current != target).sortBySeat()) {
				const choice = await current
					.chooseControl("交牌", "加伤")
					.set("choiceList", [
						"交给" + get.translation(player) + "至多" + get.cnNumber(lost) + "张手牌",
						"令此次伤害额外增加" + Math.max(0, 7 - suitSet.size) + "点",
					])
					.set("ai", () => (get.attitude(_status.event.player, target) > 0 ? "交牌" : "加伤"))
					.set("target", target)
					.forResult();
				if (choice.control == "交牌") {
					const num = Math.min(lost, current.countCards("h"));
					const give = await current.chooseCard("h", [1, num], true, "交给" + get.translation(player) + "牌").forResult();
					if (give.bool && give.cards?.length) {
						for (const card of give.cards) {
							suitSet.add(get.suit(card, current, false));
						}
						await player.gain(give.cards, current, "giveAuto");
					}
				} else {
					const add = Math.max(0, 7 - suitSet.size);
					if (useDamageCard) {
						const parent = trigger.getParent();
						parent.customArgs ??= {};
						const args = parent.customArgs[trigger.target.playerid] || (parent.customArgs[trigger.target.playerid] = {});
						args.extraDamage = (args.extraDamage || 0) + add;
					} else {
						trigger.num += add;
					}
				}
			}
		} else {
			for (const current of game.filterPlayer(current => current != player).sortBySeat()) {
				const choice = await current
					.chooseControl("摸牌", "减伤")
					.set("choiceList", [
						"令" + get.translation(player) + "摸" + Math.max(0, 7 - lost) + "张牌",
						"令此次伤害减少" + lost + "点",
					])
					.set("ai", () => (get.attitude(_status.event.player, player) > 0 ? "摸牌" : "减伤"))
					.set("target", player)
					.forResult();
				if (choice.control == "摸牌") {
					await player.draw(Math.max(0, 7 - lost));
				} else {
					trigger.num -= Math.min(trigger.num, lost);
					player.addTempSkill("vl_yue_qibu_disabled", "phaseEnd");
				}
			}
		}
		player.addTempSkill("vl_yue_qibu_pending", "phaseEnd");
		player.markAuto("vl_yue_qibu_pending", trigger.getParent ? trigger.getParent() : trigger);
		if (event.name == "damageBegin3" && trigger.num <= 0 && player.getStorage("vl_yue_qibu_cards")?.length) {
			await lib.skill.vl_yue_qibu.useQibuCards(player);
		}
	},
	group: ["vl_yue_qibu_fire", "vl_yue_qibu_gain"],
	subSkill: {
		fire: {
			mod: {
				cardnature(card, player) {
					if (card.name == "sha") return "fire";
				},
			},
			sub: true,
		},
		gain: {
			trigger: { player: "gainAfter" },
			forced: true,
			popup: false,
			charlotte: true,
			filter(event, player) {
				return player.getStorage("vl_yue_qibu_record", false) && event.cards && event.cards.length;
			},
			content(event, trigger, player) {
				player.getStorage("vl_yue_qibu_cards", []).addArray(trigger.cards);
			},
			mod: {
				cardUsableTarget(card, player, target) {
					if (player.getStorage("vl_yue_qibu_cards")?.includes(card)) return Infinity;
				},
				targetInRange(card, player, target) {
					if (player.getStorage("vl_yue_qibu_cards")?.includes(card)) return true;
				},
			},
			sub: true,
		},
		pending: {
			trigger: { player: "damageEnd" },
			forced: true,
			popup: false,
			charlotte: true,
			filter(event, player) {
				return player.hasSkill("vl_yue_qibu_pending") && player.getStorage("vl_yue_qibu_pending").includes(event.getParent ? event.getParent() : event);
			},
			async content(event, trigger, player) {
				if (player.getStorage("vl_yue_qibu_cards")?.length) {
					await lib.skill.vl_yue_qibu.useQibuCards(player);
				}
				player.unmarkSkill("vl_yue_qibu_pending");
				player.removeSkill("vl_yue_qibu_pending");
			},
			sub: true,
		},
		disabled: {
			charlotte: true,
			sub: true,
		},
	},
	t: {
		name: "七步",
		info: `你的【杀】视为火【杀】。当你使用属性伤害类即时牌或受到伤害时，你可以选择一名角色。若不为你，其他玩家依次选择一项：
		<br>1.交给你X张牌，
		<br>2.令此牌伤害增加（7-X，X为所有玩家交给你的手牌花色数）点。此牌伤害结算后，你依次使用本回合内获得的所有牌且无距离和次数限制；
		若为你，场上其余玩家依次选择一项：
		<br>1.令你摸7-X张牌，然后依次对其使用你获得的牌。你以此法得到的牌使用无距离次数限制。（X为你的已损生命值）
		<br>2.令此牌伤害-X。然后本技能本回合失效。`,
	},
};
