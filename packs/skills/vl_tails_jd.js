import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	usable: 1,
	trigger: {
		player: "useCard",
		target: "useCardToTargeted",
	},
	init(player, storage) {
		if (!player.getStorage('vl_tails_jd', null)) player.setStorage('vl_tails_jd', [0, true])
		if (!player.getStorage('vl_tails_jd_target', null)) player.setStorage('vl_tails_jd_target', [])
	},
	filter(event, player, onrewrite) {
		if (event.player == event.target) return false;
		if (player.countCards('he') < 2) return false
		if (onrewrite == 'useCard') return event.card.name == 'sha'
		return true
	},
	direct: true,
	async content(event, trigger, player) {
		event.targets = player == trigger.player ? trigger.targets : [trigger.player]
		if (!event.targets.length) {
			delete player.storage.counttrigger.vl_tails_jd
			return
		}
		let result = await player.chooseToDiscard(2, 'he', get.prompt2('vl_tails_jd')).set('ai', function (card) {
			let bads = event.targets.filter(i => get.attitude(player, i) < 0)
			if (bads.length == 0) return -1
			if (bads.length > 0 && !bads[0].mayHaveShan()) return 5 - get.value(card)
		}).forResult();
		if (result.bool) {
			if (event.targets.length != 1) {
				result = await player.chooseTarget(1, '机动：选择你的谋弈目标', function (card, player, target) {
					return event.targets.includes(target)
				}, true).set('ai', function (target) {
					return -get.attitude(player, target)
				}).forResult();
			} else {
				result = {
					bool: true,
					targets: event.targets
				}
			}
		} else {
			delete player.storage.counttrigger.vl_tails_jd
			return
		}
		if (result.bool) {
			event.target = result.targets[0]
			if (event.triggername == "useCardToTargeted") {
				trigger.untrigger()
				trigger.getParent().cancel()
			} else {
				trigger.cancel()
			}
			result = await player.chooseButton(['谋弈：请选择一种策略', [[['', '', 'vl_card_chongci'], ['', '', 'vl_card_zhuanyi']], 'vcard']], true).set('ai', function (button) {
				let player = _status.event.player;
				let target = _status.event.target;
				if (!target.mayHaveSha() && get.attitude(player, target) < 0) {
					return (button.link[2] == "vl_card_zhuanyi") ? (1.7 + Math.random()) : (1 + Math.random());
				}
				if (!target.mayHaveShan() && get.attitude(player, target) < 0) {
					return (button.link[2] == "vl_card_chongci") ? (1.7 + Math.random()) : (1 + Math.random());
				}
				return 1 + Math.random();
			}).set('target', event.target).forResult();
		} else {
			return
		}
		event.mes = result.links[0][2];
		result = await event.target.chooseToRespond(1, 'h', '选择打出一张【杀】或【闪】来响应“谋弈”', function (card) {
			return get.name(card) == 'sha' || get.name(card) == 'shan'
		}).set('ai', function (card) {
			let target = _status.event.target
			let player = _status.event.player
			let att = get.attitude(player, target)
			if (att > 0) {
				return -1
			} else {
				return Math.random()
			}
		}).set('target', player).forResult();
		event.tes = result.card
		if (result.bool) {
			player.$throw(game.createCard(event.mes, "", ""));
			game.log(player, '选择的对策为', '#g' + get.translation(event.mes));
			game.log(event.target, '选择的对策为', '#g' + get.translation(event.tes));
			game.delay(0, 1500);
		} else {
			player.$throw(game.createCard(event.mes, "", ""));
			game.log(player, '选择的对策为', '#g' + get.translation(event.mes));
			game.delay(0, 1500);
		}
		if ((event.tes && event.tes.name == 'sha' && event.mes == 'vl_card_zhuanyi') || (event.tes && event.tes.name == 'shan' && event.mes == 'vl_card_chongci')) {
			const storage = player.getStorage('vl_tails_jd', [0, true]);
			if (storage[1]) storage[1] = false
			game.log(player, '谋弈失败');
			return
		} else {
			game.log(player, '谋弈成功');
			const storage = player.getStorage('vl_tails_jd', [0, true]);
			if (storage[1] && player.isCharacter('vl_tails')) {
				storage[0] += 1
				if (storage[0] >= 8) {
				}
			}
			if (event.mes == 'vl_card_zhuanyi') {
				if (game.hasPlayer(target => {
					return !player.getStorage('vl_tails_jd_target', []).includes(target) && target != player
				})) {
					result = await player.chooseTarget('移至一名本轮未选过角色其他角色的下家，本回合潜行。', true, function (card, player, target) {
						return !player.getStorage('vl_tails_jd_target', []).includes(target) && target != player
					}).set('ai', function (target) {
						return game.players.length - target.getSeatNum() + _status.currentPhase.getSeatNum()
					}).forResult();
				} else {
					return
				}
			} else {
				await player.discardPlayerCard('he', 2, event.target, true)
				await player.recast(player.getCards('he'))
				return
			}
		}
		if (result.bool) {
			player.getStorage('vl_tails_jd_target', []).push(result.targets[0])
			player.addTempVuff('qianxing')
			game.broadcastAll(function (target1, target2) {
				game.swapSeat(target1, target2, null, true);
			}, player, result.targets[0].next);
			player.when({ 'global': 'roundStart' }).then(() => {
				player.setStorage('vl_tails_jd_target', [])
			})
		}
	},
	t: {
		name: "机动",
		info: `每回合限一次。你使用【杀】时/成为其他角色牌的目标后，可以弃两张牌令此【杀】/此牌无效，然后与对方“${get.poptip("mouyi")}”：<li>转移（打出【杀】）:移至一名本轮未选过其他角色的下家，本回合潜行。<li>冲刺（打出【闪】）：弃置其两张牌，重铸所有牌。`,
	},
};
