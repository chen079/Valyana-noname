import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseBegin",
		player: ["gainEnd", "loseEnd"],
	},
	init(player, storage) {
		player.storage.vl_nier_zj = [0]
	},
	mark: true,
	intro: {
		markcount: () => undefined,
		mark(dialog, storage, player) {
			if (!storage) return;
			var num = Math.abs(player.hp - player.countCards('h'))
			dialog.addText('已记录的值：');
			dialog.addText(storage.join('、'));
			dialog.addText('当前的值：');
			dialog.addText('' + num);
			var str
			if ((Math.abs(player.hp - player.countCards('h')) % 2) == 0 && Math.abs(player.hp - player.countCards('h')) != 0) {
				str = '你可以将一张牌当任意单体普通锦囊牌使用。'
			} else if ((Math.abs(player.hp - player.countCards('h')) % 2) != 0) {
				str = '你可以将一张牌当任意基本牌使用或打出。'
			} else {
				str = '已记录过此数值'
			}
			dialog.addText(str)
		},
	},
	direct: true,
	async content(event, trigger, player) {
		var num = Math.abs(player.hp - player.countCards('h'))
		if (player.storage.vl_nier_zj.includes(num)) {
			player.removeSkill('vl_nier_zj_odd')
			player.removeSkill('vl_nier_zj_even')
			return
			return
		}
		if ((num % 2) == 0 && num != 0) {
			player.addSkill('vl_nier_zj_even')
			player.removeSkill('vl_nier_zj_odd')
			if (!player.storage.vl_nier_zj.includes(num)) player.storage.vl_nier_zj.push(num)
		} else if ((num % 2) != 0) {
			player.addSkill('vl_nier_zj_odd')
			player.removeSkill('vl_nier_zj_even')
			if (!player.storage.vl_nier_zj.includes(num)) player.storage.vl_nier_zj.push(num)
		}
	},
	group: "vl_nier_zj_clean",
	subSkill: {
		clean: {
			trigger: {
				global: ["phaseBefore", "phaseAfter"],
			},
			forced: true,
			charlotte: true,
			async content(event, trigger, player) {
				player.storage.vl_nier_zj = [0]
			},
			sub: true,
		},
		even: {
			direct: true,
			enable: "phaseUse",
			filter(event, player) {
				return player.countCards('hes');
			},
			chooseButton: {
				dialog(event, player) {
					var cards = player.getCards('hes');
					var list = [];
					for (var i of lib.inpile) {
						var card = { name: i, isCard: true };
						var info = get.info(card, false);
						if ((!info.notarget && (info.toself || info.singleCard || !info.selectTarget || info.selectTarget == 1)) && get.type(i) == 'trick' && event.filterCard({
							name: i,
							cards: cards,
						}, player, event)) {
							list.push(['锦囊', '', i]);
						}
					}
					return ui.create.dialog('智解', [list, 'vcard']);
				},
				filter(button, player) {
					return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
				},
				check(button) {
					var player = _status.event.player;
					return player.getUseValue({ name: button.link[2] });
				},
				backup(links, player) {
					return {
						filterCard: true,
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
					return '将一张牌当作' + get.translation(links[0][2]) + '使用';
				},
			},
			ai: {
				order: 1,
				result: {
					player: 1,
				},
			},
			sub: true,
		},
		odd: {
			direct: true,
			enable: ["chooseToUse", "chooseToRespond"],
			hiddenCard(player, name) {
				if (!['sha', 'shan', 'tao', 'jiu'].includes(name)) return false;
				return player.countCards('hes') > 0;
			},
			filter(event, player) {
				if (event.filterCard({ name: 'sha' }, player, event) ||
					event.filterCard({ name: 'shan' }, player, event) ||
					event.filterCard({ name: 'jiu' }, player, event) ||
					event.filterCard({ name: 'tao' }, player, event)) {
					return player.countCards('hes') > 0;
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					var list = [];
					if (event.filterCard({ name: 'sha' }, player, event)) {
						list.push(['基本', '', 'sha']);
						for (var j of lib.inpile_nature) list.push(['基本', '', 'sha', j]);
					}
					if (event.filterCard({ name: 'shan' }, player, event)) {
						list.push(['基本', '', 'shan']);
					}
					if (event.filterCard({ name: 'tao' }, player, event)) {
						list.push(['基本', '', 'tao']);
					}
					if (event.filterCard({ name: 'jiu' }, player, event)) {
						list.push(['基本', '', 'jiu']);
					}
					return ui.create.dialog('智解', [list, 'vcard'], 'hidden');
				},
				check(button) {
					var player = _status.event.player;
					var card = { name: button.link[2], nature: button.link[3] };
					if (_status.event.getParent().type != 'phase' || game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})) {
						switch (button.link[2]) {
							case 'tao': case 'shan': return 5;
							case 'jiu': {
								if (player.countCards('hes') > 0) return 3;
							};
							case 'sha':
								if (button.link[3] == 'fire') return 2.95;
								else if (button.link[3] == 'thunder' || button.link[3] == 'ice') return 2.92;
								else return 2.9;
						}
					}
					return 0;
				},
				backup(links, player) {
					return {
						filterCard: function (card, player, event) {
							if (ui.selected.cards.length) return get.color(card, player) != get.color(ui.selected.cards[0], player);
							return true
						},
						selectCard: 1,
						check: function (card, player, target) {
							if (!ui.selected.cards.length) return 6;
							else return 6 - get.value(card);
						},
						viewAs: { name: links[0][2], nature: links[0][3] },
						position: 'hes',
						popname: true,
					}
				},
				prompt(links, player) {
					return '将一张牌当做' + get.translation(links[0][3] || '') + get.translation(links[0][2]) + '使用或打出';
				},
			},
			ai: {
				order() {
					var player = _status.event.player;
					var event = _status.event;
					if (event.filterCard({ name: 'jiu' }, player, event) && get.effect(player, { name: 'jiu' }) > 0) {
						return 3.3;
					}
					return 3.1;
				},
				skillTagFilter(player, tag, arg) {
					if (tag == 'fireAttack') return true;
					return player.countCards('hes') > 0;
				},
				result: {
					player: 1,
				},
				respondSha: true,
				respondShan: true,
				fireAttack: true,
			},
			sub: true,
		},
	},
	t: {
		name: "智解",
		info: "每名角色的回合开始/当你区域内牌数发生变化时，你记录X（X为你的体力值与手牌数之差的绝对值），若此X与你本回合内所记录过的X均不相同：若X为奇数，你可以将一张牌当任意基本牌使用或打出，若X为偶数且不为0，你可以将一张牌当任意单体普通锦囊牌使用。",
	},
};
