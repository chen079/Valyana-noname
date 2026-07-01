import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	direct: true,
	enable: "phaseUse",
	unique: true,
	filter(event, player) {
		if (player.hasSkill('vl_hynea_jiu')) {
			return player.countCards('hes', { name: ['jiu', 'shan', 'tao'] }) > 0;
		} else {
			return player.countCards('hes', { name: 'jiu' }) > 0;
		}
	},
	hiddenCard(player, name) {
		if (!['sha', 'shan', 'tao', 'jiu', 'wuxie'].includes(name)) return false;
		if (player.countCards('hes', { name: 'jiu' }) == 0) return false;
		return player.countCards('hes', { name: 'jiu' }) > 0;
	},
	chooseButton: {
		dialog(event, player) {
			let cards = player.getCards('hes');
			let list = [];
			for (let i of lib.inpile) {
				if (get.type(i) == 'trick' && event.filterCard({
					name: i,
					cards: cards,
				}, player, event)) {
					list.push(['锦囊', '', i]);
				} else if (get.type(i) == 'basic' && event.filterCard({
					name: i,
					cards: cards,
				}, player, event)) {
					if (i == 'sha') {
						for (let j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
					}
					list.push(['基本', '', i]);
				}
			}
			return ui.create.dialog('狂辩', [list, 'vcard']);
		},
		filter(button, player) {
			return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
		},
		check(button) {
			let player = _status.event.player;
			return player.getUseValue({ name: button.link[2] });
		},
		backup(links, player) {
			return {
				filterCard: function (card) {
					return get.name(card) == 'jiu'
				},
				selectCard: 1,
				check: function (card) {
					if (ui.selected.cards.length) return 0;
					return 7 - get.value(card);
				},
				position: 'hes',
				popname: true,
				viewAs: { name: links[0][2] },
			}
		},
		prompt(links, player) {
			return '将一张【酒】当作' + get.translation(links[0][2]) + '使用';
		},
	},
	ai: {
		order: 1,
		result: {
			player: 1,
		},
	},
	sub: true,
	t: {
		name: "狂辩",
		info: "你可以将一张【酒】当作任意基本牌或普通锦囊牌使用或打出。",
	},
};
