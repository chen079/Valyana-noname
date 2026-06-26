import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseBefore",
		player: ["phaseBegin", "enterGame"],
	},
	forced: true,
	filter(event, player, name) {
		if (name != "phaseBegin") {
			if (!(event.name != "phase" || game.phaseNumber == 0)) return;
		}
		if (!lib.inpile.includes('fr_equip5_wxpp')) return true;
		return !!get.cardPile(function (card) {
			return card.name == 'fr_equip5_wxpp';
		});
	},
	async content(event, trigger, player) {
		let card;
		if (!lib.inpile.includes('fr_equip5_wxpp')) {
			card = game.createCard2('fr_equip5_wxpp', 'diamond', 1);
			lib.inpile.push('fr_equip5_wxpp');
		}
		else card = get.cardPile(function (card) {
			return card.name == 'fr_equip5_wxpp';
		});
		player.chooseUseTarget(card, true, 'nopopup');
	},
	group: "vl_liya_yy_damage",
	subSkill: {
		damage: {
			trigger: {
				player: "damageEnd",
			},
			forced: true,
			filter(event, player) {
				return !player.getEquip('fr_equip5_wxpp');
			},
			async content(event, trigger, player) {
				for (let i = 0; i < trigger.num && !player.getEquip('fr_equip5_wxpp'); i++) {
					await player.draw();
					let card = get.cardPile2(function (card) {
						return get.subtype(card, false) == 'equip1' && player.canUse(card, player);
					});
					if (card) await player.chooseUseTarget(card, true, 'nopopup');
				}
			},
			sub: true,
		},
	},
	t: {
		name: "乐音",
		info: `锁定技，游戏开始或回合开始时，若${get.poptip("fr_equip5_wxpp")}未加入游戏或在牌堆/弃牌堆内，则你使用之；当你受到1点伤害后，若你的装备区里没有${get.poptip("fr_equip5_wxpp")}，则你摸一张牌并使用牌堆中的一张随机武器牌。`,
	},
};
