import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	position: "hes",
	linkage: "light",
	enable: "chooseToUse",
	filterCard(card) {
		return get.color(card) == 'red';
	},
	filter(event, player) {
		return ((player.name1 == 'vl_kulun_light') || (player.name2 == 'vl_kulun_light'));
	},
	viewAs: {
		name: "huogong",
		nature: "fire",
	},
	viewAsFilter(player) {
		if (!player.countCards('hes', { color: 'red' })) return false;
	},
	prompt: "将一张红色牌当火攻使用",
	check(card) {
		let player = _status.currentPhase;
		if (player.countCards('h') > player.hp) {
			return 6 - get.value(card);
		}
		return 4 - get.value(card)
	},
	ai: {
		fireAttack: true,
		basic: {
			order: 9.2,
			value: [3, 1],
			useful: 0.6,
		},
		wuxie(target, card, player, viewer, status) {
			if (status * get.attitude(viewer, target) < 0 || get.attitude(viewer, player) >= 0 || Math.random() * 4 > player.countCards('h')) return 0;
		},
		result: {
			player(player, target) {
				let evt = _status.event,
					h = 1,
					suits = [];
				if (!ui.selected.cards) h = 0;
				let ph = player.getCards('h', function (card) {
					if (h > 0 && ui.selected.cards.includes(card)) return false;
					if (!h && get.name(card) == 'huogong') {
						h = -1;
						return false;
					}
					let suit = get.suit(card);
					if (!suits.includes(suit)) suits.push(suit);
					return true;
				});
				if (!ph.length) {
					if (player.hasSkillTag('noh') && player.countCards('h')) return 0;
					return -10;
				}
				if (player == target) return -1;
				if (suits.length < 4) {
					if (player.hasSkillTag('viewHandcard', null, target, true)) {
						let has = 0;
						for (let i of target.getCards('h')) {
							if (suits.includes(get.suit(i, target))) has++;
						}
						if (!has) return -10;
						if (has == target.countCards('h')) return -1;
					}
					if (target.hasSkill('huogong2')) return -1.6;
					if (suits.length && player.needsToDiscard()) return -0.8 / player.needsToDiscard();
					if (Math.random() > suits.length / 4) return -10;
					if (ph.length <= player.hp && evt.name == 'chooseToUse') {
						if (typeof evt.filterCard == 'function' && evt.filterCard({ name: 'huogong' }, player, evt)) return -1.35;
						if (evt.skill) {
							let viewAs = get.info(evt.skill)?.viewAs;
							if (viewAs == 'huogong') return -1.35;
							if (viewAs && viewAs.name == 'huogong') return -1.35;
						}
					}
				}
				return -1;
			},
			target(player, target) {
				if (target.countCards('h') == 0) return 0;
				let evt = _status.event,
					h = 1,
					suits = [];
				if (!ui.selected.cards) h = 0;
				let ph = player.getCards('h', function (card) {
					if (h > 0 && ui.selected.cards.includes(card)) return false;
					if (!h && get.name(card) == 'huogong') {
						h = -1;
						return false;
					}
					let suit = get.suit(card);
					if (!suits.includes(suit)) suits.push(suit);
					return true;
				});
				if (!ph.length) return 0;
				if (target == player) {
					if (typeof evt.filterCard == 'function' && evt.filterCard({ name: 'huogong' }, player, evt)) return -1.15;
					if (evt.skill) {
						let viewAs = get.info(evt.skill)?.viewAs;
						if (viewAs == 'huogong') return -1.15;
						if (viewAs && viewAs.name == 'huogong') return -1.15;
					}
					return 0;
				}
				if (target.hasSkill('huogong2') && suits.length < 4) return 0;
				if (get.attitude(player, target) >= 0) return -0.15;
				if (player.hasSkillTag('viewHandcard', null, target, true)) return -0.5 * suits.length;
				return -0.45 * suits.length;
			},
		},
		tag: {
			damage: 1,
			fireDamage: 1,
			natureDamage: 1,
			discard: 0.5,
			norepeat: 1,
		},
	},
	_priority: 0,
	t: {
		name: "熔光",
		info: "连携-光明：出牌阶段，你可以将一张红色牌当【火攻】使用。",
	},
};
