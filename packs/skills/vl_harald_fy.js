import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	preHidden: true,
	filterCard: true,
	filterTarget(card, player, target) {
		return target != player && target.countCards('he') > 0;
	},
	async content(event, trigger, player) {
		const target = event.target;
		const result = await player.choosePlayerCard('hej', target, true).forResult();
		if (result.bool && result.links && result.links.length) {
			let card = result.links[0];
			let cardx = get.autoViewAs({ name: 'sha' }, [card]);
			await target.useCard(cardx, [card], player, false)
		}
	},
	ai: {
		order: 8,
		result: {
			target: -1,
			player(player, target) {
				if (player.hasSkillTag('maixie') || player.countCards('h', 'shan') > 0) {
					return get.effect(target, { name: 'guohe_copy2' }, player, player)
				}
				return -1
			},
			expose: 0.2,
			effect: {
				target(card, player, target) {
					if (card.name != 'sha') return;
					let players = game.filterPlayer();
					if (get.attitude(player, target) <= 0) {
						for (let i = 0; i < players.length; i++) {
							let target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) &&
								get.effect(target2, { name: 'shacopy', nature: card.nature, suit: card.suit }, player, target) > 0 &&
								get.effect(target2, { name: 'shacopy', nature: card.nature, suit: card.suit }, player, player) < 0) {
								if (target.hp == target.maxHp) return 0.3;
								return 0.6;
							}
						}
					} else {
						for (let i = 0; i < players.length; i++) {
							let target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) &&
								get.effect(target2, { name: 'shacopy', nature: card.nature, suit: card.suit }, player, player) > 0) {
								if (player.canUse(card, target2)) return;
								if (target.hp == target.maxHp) return [0, 1];
								return [0, 0];
							}
						}
					}
				},
			},
		},
	},
	group: "vl_harald_fy_1",
	subSkill: {
		"1": {
			async content(event, trigger, player) {
				const chooseTarget = await player.chooseTarget(get.prompt2('vl_harald_fy'), function (card, player, target) {
					return target != player && !_status.event.targets.includes(target) && _status.event.playerx.canUse('sha', target, false) && target.countCards('h');
				}).set('ai', function (target) {
					let trigger = _status.event.getTrigger();
					let player = _status.event.player;
					return get.effect(target, trigger.card, trigger.player, player) + 0.1;
				}).set('targets', trigger.targets).set('playerx', trigger.player).forResult();
				if (chooseTarget.bool) {
					event.target = chooseTarget.targets[0];
					player.logSkill('vl_harald_fy', event.target);
					const chooseCard = await event.target.chooseCard('选择' + get.translation(player) +
						'一张牌，若此牌不为' + get.translation(player) + '选择的花色，则也成为此【杀】的额外目标', true).set('ai', function (card) {
							return -get.value(card, player, 'raw');
						}).set('sourcex', player).forResult();
					await game.delay();
					event.card = chooseCard.cards[0]
				} else {
					return;
				}
				let next = player.chooseButton(['请选择一种花色', [lib.suit.map(i => ['', '', 'lukai_' + i]), 'vcard']], 1, true)
				next.set('ai', button => {
					return Math.random;
				});
				const chooseSuit = await next.forResult();
				if (chooseSuit.bool) {
					let suit = chooseSuit.links[0][2].slice(6);
					await event.target.give(event.card, player, 'give');
					if (get.suit(event.card) != suit) {
						trigger.getParent().targets.push(event.target);
						trigger.getParent().triggeredTargets2.push(event.target);
						if (event.target.countCards('h') >= player.countCards('h')) trigger.directHit.push(event.target);
						game.log(event.target, '成为了额外目标');
					}
					await game.delay();
				}
			},
			trigger: {
				target: "useCardToTarget",
			},
			direct: true,
			filter(event, player) {
				return event.card.name == 'sha' && game.hasPlayer(function (current) {
					return current != player && current != event.source
				}) && game.players.length > 2;
			},
		},
	},
	t: {
		name: "锋移",
		info: "出牌阶段限一次，你可以弃置一张牌，然后将一名其他角色区域内的一张牌当【杀】对你使用。当你成为【杀】的目标时，你可以令另一名有手牌的其他角色选择一张牌，然后你选择一种花色并令其将选择的牌正面朝上交给你，若此牌花色与你声明的花色不同，则该角色也成为此【杀】的额外目标，若该角色的手牌数不小于你，其不可响应此【杀】。",
	},
};
