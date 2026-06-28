import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: ["chooseToUse", "chooseToRespond"],
	hiddenCard(player, name) {
		const used = player.getStorage('vl_charlin_qs', []);
		return (lib.inpile.includes(name) && !used.includes(name) && player.countCards('h') > 0);
	},
	init: player => {
		if (!player.hasStorage('vl_charlin_qs')) player.setStorage('vl_charlin_qs', []);
	},
	mark: true,
	filter(event, player) {
		if (!player.countCards('hs')) return false;
		const used = player.getStorage('vl_charlin_qs', []);
		for (const i of lib.inpile.filter(i => !used.includes(i))) {
			const type = get.type(i);
			if ((type == 'basic' || type == 'trick') && lib.filter.filterCard({
				name: i
			}, player, event)) return true;
		}
		return false;
	},
	chooseButton: {
		dialog(event, player) {
			const list = [];
			const used = player.getStorage('vl_charlin_qs', []);
			for (let i = 0; i < lib.inpile.length; i++) {
				const name = lib.inpile[i];
				if (used.includes(name)) continue;
				if (name == 'sha') {
					if (event.filterCard({
						name: name
					}, player, event)) list.push(['基本', '', 'sha']);
					for (const j of lib.inpile_nature) {
						if (event.filterCard({
							name: name,
							nature: j
						}, player, event)) list.push(['基本', '', 'sha', j]);
					}
				} else if (get.type(name) == 'trick' && event.filterCard({
					name: name
				}, player, event)) list.push(['锦囊', '', name]);
				else if (get.type(name) == 'basic' && event.filterCard({
					name: name
				}, player, event)) list.push(['基本', '', name]);
			}
			return ui.create.dialog('曲实', [list, 'vcard']);
		},
		filter(button, player) {
			return _status.event.getParent()
				.filterCard({
					name: button.link[2]
				}, player, _status.event.getParent());
		},
		backup(links, player) {
			return {
				filterCard: true,
				selectCard: 1,
				position: 'hs',
				viewAs: {
					name: links[0][2],
					nature: links[0][3]
				},
			}
		},
		prompt(links, player) {
			return '将一张牌当做' + (get.translation(links[0][3]) || '') + get.translation(links[0][2]) + '使用';
		},
	},
	ai: {
		fireAttack: true,
		respondShan: true,
		respondSha: true,
		skillTagFilter(player) {
			if (!player.countCards('hs')) return false;
		},
		order: 10,
		result: {
			player: 1,
		},
		threaten: 1.3,
	},
	group: ["vl_charlin_qs_guess"],
	subSkill: {
		guess: {
			trigger: {
				player: ["useCardBefore", "respondBefore"],
			},
			forced: true,
			silent: true,
			popup: false,
			firstDo: true,
			filter(event, player) {
				return event.skill && event.skill.indexOf('vl_charlin_qs_') == 0;
			},
			async content(event, trigger, player) {
				const card = trigger.cards[0];
				player.markAuto('vl_charlin_qs', trigger.card.name);
				player.line(trigger.targets, get.nature(trigger.card));
				event.cardTranslate = get.translation(trigger.card.name);
				trigger.card.number = get.number(card);
				trigger.card.suit = get.suit(card);
				trigger.skill = 'vl_charlin_qs_backup';
				if (trigger.card.name == 'sha' && trigger.card.nature) event.cardTranslate = get.translation(trigger.card.nature) + event.cardTranslate;
				player.popup(event.cardTranslate, trigger.name == 'useCard' ? 'metal' : 'wood');
				event.prompt = '是否质疑' + get.translation(player) + '声明的' + event.cardTranslate + '？';
				game.log(player, '声明了', '#y' + event.cardTranslate);
				event.targets = game.filterPlayer(function (current) {
					return current != player && !current.hasVuff('shisheng');
				}).sortBySeat();
				game.broadcastAll(function (card) {
					_status.guhuoNode = card.copy('thrown');
					if (lib.config.cardback_style != 'default') {
						_status.guhuoNode.style.transitionProperty = 'none';
						ui.refresh(_status.guhuoNode);
						_status.guhuoNode.classList.add('infohidden');
						ui.refresh(_status.guhuoNode);
						_status.guhuoNode.style.transitionProperty = '';
					} else {
						_status.guhuoNode.classList.add('infohidden');
					}
					_status.guhuoNode.style.transform = 'perspective(600px) rotateY(180deg) translateX(0)';
					player.$throwordered2(_status.guhuoNode);
				}, trigger.cards[0]);
				event.onEnd01 = function () {
					_status.guhuoNode.removeEventListener('webkitTransitionEnd', event.onEnd01);
					_status.guhuoNode.style.transition = 'all ease-in 0.3s';
					_status.guhuoNode.style.transform = 'perspective(600px) rotateY(270deg) translateX(52px)';
					const onEnd = function () {
						_status.guhuoNode.classList.remove('infohidden');
						_status.guhuoNode.style.transition = 'all 0s';
						ui.refresh(_status.guhuoNode);
						_status.guhuoNode.style.transform = 'perspective(600px) rotateY(-90deg) translateX(52px)';
						ui.refresh(_status.guhuoNode);
						_status.guhuoNode.style.transition = '';
						ui.refresh(_status.guhuoNode);
						_status.guhuoNode.style.transform = '';
						_status.guhuoNode.removeEventListener('webkitTransitionEnd', onEnd);
					}
					_status.guhuoNode.listenTransition(onEnd);
				};
				event.targets2 = event.targets.slice(0);
				player.lose(card, ui.ordering).relatedEvent = trigger;
				const result = await player.chooseButton([event.prompt, [
					['reguhuo_ally', 'reguhuo_betray'], 'vcard']], true, function (button) {
						const player = _status.event.player;
						const evt = _status.event.getParent('vl_charlin_qs_guess');
						if (!evt) return Math.random();
						const ally = button.link[2] == 'reguhuo_ally';
						if (ally && (player.hp <= 1 || get.attitude(player, evt.player) >= 0)) return 1.1;
						return Math.random();
					}).forResult();
				if (!result.links || !result.links.length) return;
				if (result.links[0][2] == 'reguhuo_betray') {
					event.betrays.push(player);
					player.addExpose(0.2);
				}
				game.broadcastAll(function (onEnd) {
					_status.guhuoNode.listenTransition(onEnd);
				}, event.onEnd01);
				game.delay(3.2);
				if (event.betrays.length) {
					event.betrays.sortBySeat();
					if (event.fake) {
						trigger.cancel();
						trigger.getParent().goto(0);
						game.log(player, '声明的', '#y' + event.cardTranslate, '作废了')
					}
					if (event.betrays.filter(i => player.canCompare(i)).length) {
						const next = game.createEvent('vl_charlin_qs', false);
						event.next.remove(next);
						trigger.after.push(next);
						next.player = player
						next.targets = event.betrays.filter(i => player.canCompare(i));
						next.setContent(lib.skill.vl_charlin_fs.content);
					}
					game.broadcastAll(ui.clear);
				} else return;
				game.delayx();
			},
			_priority: 1,
		},
	},
	t: {
		name: "曲实",
		info: `每种牌名限一次，你可以扣置一张手牌当作一张基本牌或普通锦囊牌使用或打出。其他没有「失声」的角色同时选择是否质疑。若有质疑的角色：你可以对所有质疑的角色发动一次${get.poptip("vl_charlin_fs")}，然后，你展示此牌，若此牌为假，则此牌作废。`,
	},
};
