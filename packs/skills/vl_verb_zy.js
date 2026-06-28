import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filter(event, player) {
		return game.hasPlayer(target => target.countCards('h') && target != player);
	},
	filterTarget(card, player, target) {
		return target.countCards('h') && target != player;
	},
	selectTarget: -1,
	multitarget: true,
	content: async function content(event, trigger, player) {
		const targets = event.targets;
		for (let target of targets) {
			const result = await target.chooseCard('he', '征言：交给' + get.translation(player) + '一张牌，或失去1点体力').set('ai', function (card) {
				if (target.getCards('he').length == 0) return false;
				let att = get.attitude(target, player);
				if (att > 0) return 1;
				else {
					if (card.name == 'tao') return 0;
					else return 20 - get.value(card);
				}
			}).forResult();
			if (!result.bool) {
				await target.loseHp();
			}
			else {
				await target.give(result.cards, player, true);
			}
		}
		const evt = event.getParent("phaseUse", true);
		player
			.when("phaseUseEnd")
			.filter(evtx => evtx == evt)
			.step(async (event, trigger, player) => {
				for (let target of targets) {
					if (player.countCards('h') == 0) return;
					if (!target.isIn()) continue;
					const result = await player.chooseCard('h', true, 1, '征言：选择要交给' + get.translation(target) + '的牌').set('ai', function (card) {
						let att = get.attitude(player, target)
						if (att > 0) { return get.value(card) }
						else return 100 - get.value(card)
					}).forResult();
					if (!result.cards.length) return;
					await player.give(result.cards, target);
				}
			});
		// player.addSkill('vl_verb_zy_2');
		// player.setStorage('vl_verb_zy', targets.filter(c=>c.isIn()));
	},
	ai: {
		order: 10,
		result: {
			player: 1,
		},
		threaten: 1.5,
	},
	t: {
		name: "征言",
		info: "出牌阶段限一次，你令有手牌的角色依次选择一项：1.交给你一张牌，2.失去1点体力；出牌阶段结束时，你须依次交给这些角色一张手牌。",
	},
};
