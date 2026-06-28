import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

export default {
	trigger: {
		player: "phaseBegin",
	},
	forced: true,
	async content(event, trigger, player) {
		await player.loseMaxHp();
		await player.draw(2);
	},
	group: "vl_yue_yh_end",
	subSkill: {
		end: {
			trigger: {
				player: "phaseEnd",
			},
			forced: true,
			filter(event, player) {
				return player.maxHp > 0 && game.hasPlayer(current => current != player);
			},
			async content(event, trigger, player) {
				const cards = get.cards(player.maxHp);
				await game.cardsGotoOrdering(cards);
				await player.showCards(cards, get.translation(player) + "发动了【遗恨】");
				const shas = cards.filter(card => card.name == "sha");
				if (!shas.length) return;
				const result = await player
					.chooseTarget("遗恨：选择一名其他角色，对其使用亮出的所有【杀】", true, (card, player, target) => target != player)
					.set("ai", target => -get.attitude(_status.event.player, target))
					.forResult();
				if (!result.bool) return;
				const target = result.targets[0];
				for (const card of shas) {
					if (!target.isIn() || !player.canUse(card, target, false)) continue;
					await player.useCard(card, target, false).set("addCount", false);
				}
			},
			sub: true,
		},
	},
	t: {
		name: "遗恨",
		info: "锁定技，回合开始时，你失去1点体力上限并摸两张牌。你的回合结束时，你亮出牌堆顶X张牌，并对一名其他角色使用其中的所有【杀】（X为你的体力上限）。",
	},
};
