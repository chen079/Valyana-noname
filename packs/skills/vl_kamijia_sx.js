import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	multitarget: true,
	discard: false,
	lose: false,
	delay: false,
	selectTarget: 2,
	complexTarget: true,
	targetprompt: ["获得牌", "使用目标"],
	filter(event, player) {
		return player.countCards('h') > 0
	},
	filterTarget(card, player, target) {
		if (ui.selected.targets.length) {
			return true
		} else {
			return target != player
		}
	},
	position: "h",
	filterCard: true,
	selectCard: -1,
	async content(event, trigger, player) {
		const targets = event.targets
		const cards = event.cards
		await targets[0].gain(cards, player, 'giveAuto')
		targets[0].addTempSkill('vl_kamijia_sx_unuse', { player: 'phaseAfter' })
		if (!targets[0].getStorage('vl_kamijia_sx_unuse', null)) {
			targets[0].setStorage('vl_kamijia_sx_unuse', {
				source: player,
				target: [],
				num: 0,
				gain: 0
			})
		}
		const storage = targets[0].getStorage('vl_kamijia_sx_unuse', {});
		storage.gain += cards.length
		storage.num++
		storage.target.push(targets[1])
		let evt = _status.event.getParent('phaseUse');
		if (evt) {
			evt.skipped = true;
		}
	},
	ai: {
		order: 1,
		result: {
			player: 1,
			target(player, target) {
				if (ui.selected.targets.length) {
					return -3
				} else {
					let pc = player.countCards('h')
					let tc = target.countCards('h')
					if (get.attitude(player, target) > 0) {
						return 3
					} else {
						if (pc < 2) {
							return -3
						} else if (tc > pc) {
							return -1
						} else {
							return -2
						}
					}
				}
			},
		},
	},
	subSkill: {
		unuse: {
			mark: true,
			intro: {
				mark(dialog, storage, player) {
					const data = player.getStorage('vl_kamijia_sx_unuse', { target: [], num: 0 });
					dialog.addText('<li>①出牌阶段，你可以额外使用' + get.cnNumber(data.num) + '张【杀】');
					dialog.addText('<li>②你使用牌无距离限制')
					dialog.addText(' <li>③你只能对' + get.translation(data.target) + '和自己使用牌。')
				},
			},
			onremove(player) {
				player.setStorage('vl_kamijia_sx_unuse', null)
			},
			trigger: {
				player: "loseAfter",
				global: "loseAsyncAfter",
			},
			charlotte: true,
			forced: true,
			filter(event, player) {
				const storage = player.getStorage('vl_kamijia_sx_unuse', {});
				if (event.type != 'discard' || event.getlx === false || event.getParent('phaseDiscard').player != player || !storage.source || !storage.source.isIn()) return false;
				let evt = event.getl(player);
				return evt && evt.cards2.filterInD('d').length > 0;
			},
			logTarget(event, player) {
				return player.getStorage('vl_kamijia_sx_unuse', {}).source
			},
			async content(event, trigger, player) {
				if (trigger.delay === false) game.delay();
				let cards = trigger.getl(player).cards2.filterInD('d')
				const storage = player.getStorage('vl_kamijia_sx_unuse', {});
				if (Math.floor(storage.gain / 2) != 0 && cards.length) {
					const result = await storage.source.chooseCardButton('获得' + get.translation(player) + '弃置的牌中至多' + get.cnNumber(Math.min(cards.length, 5, Math.floor(storage.gain / 2))) + '张牌', [1, Math.min(cards.length, 5, Math.floor(storage.gain / 2))], cards)
						.set('ai', function (button) {
							get.useful(button.link);
						}).forResult()
					if (result.bool) {
						await storage.source.gain(result.links, 'gain2')
					} else {
						return
					}
				} else {
					return
				}
			},
			mod: {
				targetInRange(card, player, target, now) {
					return true
				},
				playerEnabled(card, player, target) {
					if (player != target && !player.getStorage('vl_kamijia_sx_unuse', { target: [] }).target.includes(target)) return false;
				},
				cardUsable(card, player, num) {
					if (card.name == 'sha') return num + player.getStorage('vl_kamijia_sx_unuse', { num: 0 }).num;
				},
			},
		},
	},
	t: {
		name: "随行",
		info: "出牌阶段限一次，你可以将你的所有手牌交给一名其他角色（至少一张）并结束此回合，然后该角色获得以下效果直到其回合结束：<li>①使用牌无距离限制，<li>②出牌阶段，可以额外使用一张【杀】，<li>③只能对自己与你指定的另一名角色使用牌。</li>你获得该角色于弃牌阶段弃置的至多X张牌（X为你交给该角色的牌数的一半并向下取整且至多为五）。</li>",
	},
};
