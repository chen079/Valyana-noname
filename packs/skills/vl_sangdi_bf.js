import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "dying",
	},
	direct: true,
	filter(event, player) {
		if (event.player == player) return false
		return player.countCards('h') > 0 && event.player.countCards('h') > 0 && !player.hasSkill('vl_sangdi_bf_blocker')
	},
	async content(event, trigger, player) {
		const allowResult = await trigger.player.chooseBool('是否令' + get.translation(player) + '观看你的手牌，然后其就可以与你交换一张牌。')
			.set('ai', function () {
				const player = _status.event.player
				const target = _status.event.target
				if (get.attitude(player, target) > 0) return true
				return false
			}).set('target', player).forResult();
		if (allowResult.bool) {
			const buttonResult = await player.chooseCardButton(get.prompt('vl_sangdi_bf'), trigger.player.getCards('h')).set('ai', function (button) {
				return get.value(button.link) - 5;
			}).forResult();
			if (buttonResult.bool) {
				const selectedCard = buttonResult.links[0];
				const cardResult = await player.chooseCard('h', true, '用一张手牌替换' + get.translation(selectedCard)).set('ai', function (card) {
					return -get.value(card);
				}).forResult();
				if (cardResult.bool) {
					await trigger.player.give(selectedCard, player, false);
					await player.give(cardResult.cards, trigger.player, false);
					game.log(player, '与', trigger.player, '交换了一张手牌');
					player.addTempSkill('vl_sangdi_bf_blocker')
				}
			}
		} else {
			return
		}
	},
	subSkill: {
		blocker: {},
	},
	ai: {
		order: 2,
		threaten: 1.5,
		result: {
			player: 1,
		},
	},
	_priority: 0,
	t: {
		name: "捕风",
		info: "每回合限一次，一名有手牌的其他角色进入濒死阶段时，其可以令你观看其手牌，然后可以用一张手牌交换其中一张。",
        taici: ['暴风听令，撕开阵线。', '你躲不开风，也躲不开我。'],
    },
};
