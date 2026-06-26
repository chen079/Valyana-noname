import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	filter(event, player) {
		return player.countCards('he', function (card) {
			return get.type(card) == 'equip'
		}) >= 2
	},
	filterCard(card) {
		if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) return false;
		let info = get.info(card);
		return info.type == 'equip';
	},
	selectCard: 2,
	position: "he",
	check(card) {
		return get.value(card);
	},
	async content(event, trigger, player) {
		const cards = event.cards;
		let name = cards[0].name + '_' + cards[1].name;
		let info1 = get.info(cards[0]), info2 = get.info(cards[1]);
		if (!lib.card[name]) {
			let info = {
				enable: true,
				type: 'equip',
				subtype: get.subtype(cards[0]),
				vanish: true,
				cardimage: info1.cardimage || cards[0].name,
				filterTarget: function (card, player, target) {
					return target == player;
				},
				selectTarget: -1,
				modTarget: true,
				content: lib.element.content.equipCard,
				legend: true,
				source: [cards[0].name, cards[1].name],
				onEquip: [],
				onLose: [],
				skills: [],
				distance: {},
				ai: {
					order: 8.9,
					equipValue: 10,
					useful: 2.5,
					value: function (card, player) {
						let value = 0;
						let info = get.info(card);
						let current = player.getEquip(info.subtype);
						if (current && card != current) {
							value = get.value(current, player);
						}
						let equipValue = info.ai.equipValue || info.ai.basic.equipValue;
						if (typeof equipValue == 'function') return equipValue(card, player) - value;
						return equipValue - value;
					},
					result: {
						target: function (player, target) {
							return get.equipResult(player, target, name);
						}
					}
				}
			}
			for (let i in info1.distance) {
				info.distance[i] = info1.distance[i];
			}
			for (let i in info2.distance) {
				if (typeof info.distance[i] == 'number') {
					info.distance[i] += info2.distance[i];
				}
				else {
					info.distance[i] = info2.distance[i];
				}
			}
			if (info1.skills) {
				info.skills = info.skills.concat(info1.skills);
			}
			if (info2.skills) {
				info.skills = info.skills.concat(info2.skills);
			}
			if (info1.onEquip) {
				if (Array.isArray(info1.onEquip)) {
					info.onEquip = info.onEquip.concat(info1.onEquip);
				}
				else {
					info.onEquip.push(info1.onEquip);
				}
			}
			if (info2.onEquip) {
				if (Array.isArray(info2.onEquip)) {
					info.onEquip = info.onEquip.concat(info2.onEquip);
				}
				else {
					info.onEquip.push(info2.onEquip);
				}
			}
			if (info1.onLose) {
				if (Array.isArray(info1.onLose)) {
					info.onLose = info.onLose.concat(info1.onLose);
				}
				else {
					info.onLose.push(info1.onLose);
				}
			}
			if (info2.onLose) {
				if (Array.isArray(info2.onLose)) {
					info.onLose = info.onLose.concat(info2.onLose);
				}
				else {
					info.onLose.push(info2.onLose);
				}
			}
			if (info.onEquip.length == 0) delete info.onEquip;
			if (info.onLose.length == 0) delete info.onLose;
			lib.card[name] = info;
			lib.translate[name] = get.translation(cards[0].name, 'skill') + get.translation(cards[1].name, 'skill');
			let str = lib.translate[cards[0].name + '_info'];
			if (str[str.length - 1] == '.' || str[str.length - 1] == '。') {
				str = str.slice(0, str.length - 1);
			}
			lib.translate[name + '_info'] = str + '；' + lib.translate[cards[1].name + '_info'];
			try {
				game.addVideo('newcard', null, {
					name: name,
					translate: lib.translate[name],
					info: lib.translate[name + '_info'],
					card: cards[0].name,
					legend: true,
				});
			}
			catch (e) {
				console.log(e);
			}
		}
		player.gain(game.createCard({ name: name, suit: cards[0].suit, number: cards[0].number }), 'gain2');
	},
	ai: {
		order: 9.5,
		result: {
			player: 1,
		},
	},
	group: "vl_sheep_rh_recover",
	subSkill: {
		recover: {
			prompt: "重铸一张装备牌，然后将体力回复至1点。",
			enable: "chooseToUse",
			filterCard(card) {
				return get.type(card) == 'equip';
			},
			filter(event, player) {
				if (event.type == 'dying') {
					if (player != event.dying) return false;
					return player.countCards('he', function (card) {
						return get.type(card) == 'equip';
					}) > 0;
				}
				return false;
			},
			check() {
				return 1;
			},
			position: "he",
			discard: false,
			loseTo: "discardPile",
			prepare(cards, player) {
				player.$throw(cards, 1000);
				game.log(player, '将', cards, '置入了弃牌堆')
			},
			async content(event, trigger, player) {
				await player.draw();
				let num = 1 - player.hp;
				if (num) await player.recover(num);
			},
			ai: {
				order: 0.5,
				skillTagFilter(player, arg, target) {
					if (player != target) return false;
					return player.countCards('he', function (card) {
						if (_status.connectMode && get.position(card) == 'h') return true;
						return get.subtype(card) == 'equip2';
					}) > 0;
				},
				save: true,
				result: {
					player(player) {
						return 10;
					},
				},
			},
		},
	},
	t: {
		name: "熔合",
		info: ` 出牌阶段，你可以将两张装备牌“${get.poptip("hecheng")}”为一张装备牌；当你处于濒死状态时，你可以重铸一张装备牌，然后将体力回复至1点。`,
	},
};
