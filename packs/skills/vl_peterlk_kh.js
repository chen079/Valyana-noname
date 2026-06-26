import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable(skill, player) {
		return player.getDamagedHp() + 2;
	},
	filter(event, player) {
		return player.countCards('h', 'sha') > 0 || player.countCards('h', { type: ['trick', 'delay'] }) > 0
			&& player.countCards('h', { type: 'trick' }) != player.countCards('h', 'wuxie')
	},
	filterCard(card, player, target) {
		return (card.name == 'sha' || get.type(card, 'trick') == 'trick') && card.name != 'wuxie';
	},
	discard: false,
	lose: false,
	delay: false,
	selectCard: 1,
	filterTarget(card, player, target) {
		return target != player;
	},
	ai1(card) {
		return 6 - get.value(card);
	},
	ai2(target) {
		let att = get.attitude(_status.event.player, target);
		return att;
	},
	position: "h",
	async content(event, trigger, player) {
		const targets = event.targets
		const cards = event.cards
		await targets[0].gain(cards, player, 'give')
		if (game.hasPlayer(function (current) {
			return targets[0].canUse(cards[0], current);
		})) {
			const result = await player.chooseTarget(get.prompt('vl_peterlk_kh'), '控魂：选择' + get.translation(cards[0]) + '的目标？', function (card, player, target) {
				const playerx = _status.event.source;
				return playerx.canUse(_status.event.card, target);
			}).set('ai', function (target) {
				const player = _status.event.source;
				const card = _status.event.card;
				return get.effect(target, card, player, _status.event.player);
			}).set('card', cards[0]).set('source', targets[0]).setHiddenSkill(event.name).forResult();
			if (result.bool) {
				await targets[0].useCard(cards[0], result.targets[0], false)
			}
		} else {
			return
		}
	},
	ai: {
		order: 8,
		result: {
			player: 1,
		},
	},
	t: {
		name: "控魂",
		info: "出牌阶段限X+2次（X为你的已损体力值），你可以将一张【杀】或锦囊牌（无懈可击除外）交给一名其他角色，然后你可以令该角色对你指定的角色使用此牌（目标需合法）。",
	},
};
