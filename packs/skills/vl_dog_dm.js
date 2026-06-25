import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filter(event, player) {
		return event.filterCard({
			name: 'fr_card_gzbj',
		}, player, event) || event.filterCard({
			name: 'diaobingqianjiang',
		}, player, event);
	},
	chooseButton: {
		dialog() {
			return ui.create.dialog('多谋', [['fr_card_gzbj', 'diaobingqianjiang'], 'vcard']);
		},
		filter(button, player) {
			var evt = _status.event.getParent();
			return evt.filterCard({
				name: button.link[2],
			}, player, evt);
		},
		check(button) {
			return _status.event.player.getUseValue({
				name: button.link[2],
			}) * (button.link[2] == 'diaobingqianjiang' ? 3 : 1);
		},
		backup(links) {
			return {
				viewAs: { name: links[0][2] },
				filterCard: true,
				position: 'hs',
				check: function (card) {
					return 6 - get.value(card);
				},
				selectCard: 2,
			}
		},
		prompt(links) {
			return '将两张手牌当做【' + get.translation(links[0][2]) + '】使用';
		},
	},
	ai: {
		order(item, player) {
			return Math.max(get.order({ name: 'fr_card_gzbj' }), get.order({ name: 'diaobingqianjiang' })) + 0.2;
		},
		result: {
			player: 1,
		},
	},
	t: {
		name: "多谋",
		info: "出牌阶段限一次，你可以将两张牌当【寡众不均】或【调兵遣将】使用。",
	},
};
