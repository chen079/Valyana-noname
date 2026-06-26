import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "useCard",
	},
	filter(event, player) {
		return event.player.hasHistory('lose', function (evt) {
			if (evt.getParent() != event) return false;
			for (let i in evt.gaintag_map) {
				if (evt.gaintag_map[i].includes('vl_dragon_hn')) return true;
			}
			return false;
		});
	},
	mark: true,
	intro: {
		content: "你使用“魂怒”牌：①不可被响应、②无视防具、③不计入使用次数、④不计入手牌上限、⑤不可被其他角色弃置、⑥无距离限制。",
	},
	forced: true,
	async content(event, trigger, player) {
		if (trigger.card.name == 'sha') {
			player.getStat().card.sha--;
		}
		player.addTempSkill('unequip', { player: 'useCardAfter' })
		trigger.directHit.addArray(game.players);
	},
	ai: {
		threaten: 2,
	},
	group: "vl_dragon_hn_ig",
	subSkill: {
		ig: {
			mod: {
				ignoredHandcard(card, player) {
					if (card.hasGaintag('vl_dragon_hn')) {
						return true;
					}
				},
				targetInRange(card) {
					if (!card.cards) return;
					for (let i of card.cards) {
						if (i.hasGaintag('vl_dragon_hn')) return true;
					}
				},
				canBeDiscarded(card) {
					if (card.hasGaintag('vl_dragon_hn')) return false;
				},
				cardDiscardable(card, player, name) {
					if (name == 'phaseDiscard' && card.hasGaintag('vl_dragon_hn')) return false;
				},
				aiOrder(player, card, num) {
					if (_status.currentPhase == player) {
						if (get.itemtype(card) == 'card' && card.hasGaintag('vl_dragon_hn')) return num + 1;
					} else {
						if (get.itemtype(card) == 'card' && card.hasGaintag('vl_dragon_hn')) return num - 1;
					}
				},
			},
			sub: true,
		},
	},
	t: {
		name: "魂怒",
		info: "你使用“魂怒”牌：①不可被响应、②无视防具、③不计入使用次数、④不计入手牌上限、⑤不可被其他角色弃置、⑥无距离限制。",
	},
};
