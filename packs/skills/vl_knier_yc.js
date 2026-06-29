import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseZhunbeiBegin",
	},
	filter(event, player) {
		return event.player.countCards('ej') > 0 && event.player != player
	},
	check(event, player) {
		if (get.attitude(player, event.player) > 0 && (event.player.countCards('ej', { suit: 'spade' }) || event.player.countCards('ej', { suit: 'club' }))) return true
		if (get.attitude(player, event.player) < 0 && (event.player.countCards('ej', { suit: 'heart' }) || event.player.countCards('ej', { suit: 'diamond' }))) return true
		return false
	},
	async content(event, trigger, player) {
		const result = await player.choosePlayerCard(trigger.player, false, 'ej', '选择' + get.translation(trigger.player) + '判定区或装备区的一张牌').set('ai', function (card) {
			let player = _status.event.player
			let target = _status.event.target
			if (get.attitude(player, target) > 0) {
				if (target.countCards('j') > 0) {
					if (get.suit(card) == 'spade') {
						return 1
					} else {
						return 0
					}
				} else if (target.countCards('h') > target.maxHp) {
					if (get.suit(card) == 'club') {
						return 1
					} else {
						return 0
					}
				}
			} else {
				switch (get.suit(card)) {
					case 'heart': return Math.random;
					case 'diamond': return Math.random;
					case 'spade': return -1;
					case 'club': return -1;
				}
			}
		}).set('target', trigger.player).forResult()
		if (result.bool) {
			let card = result.cards[0];
			let cardx = get.autoViewAs({ name: 'sha' }, [card]);
			let target = trigger.player
			const next = target.useCard(cardx, [card], player, false);
			switch (get.suit(card)) {
				case 'heart':
					target.skip('phaseUse');
					target.addTempSkill('vl_knier_yc_1', { player: 'phaseUseSkipped' })
					target.setStorage('vl_knier_yc_1', 'Use'); break;
				case 'diamond':
					target.skip('phaseDraw');
					target.addTempSkill('vl_knier_yc_1', { player: 'phaseDrawSkipped' })
					target.setStorage('vl_knier_yc_1', 'Draw'); break;
				case 'spade':
					target.skip('phaseJudge');
					target.addTempSkill('vl_knier_yc_1', { player: 'phaseJudgeSkipped' })
					target.setStorage('vl_knier_yc_1', 'Judge'); break;
				case 'club':
					target.skip('phaseDiscard');
					target.addTempSkill('vl_knier_yc_1', { player: 'phaseDiscardSkipped' })
					target.setStorage('vl_knier_yc_1', 'Discard'); break;
			}
			target.markSkill('vl_knier_yc_1')
			await next
		}
	},
	subSkill: {
		"1": {
			onremove(player) {
				player.unmarkSkill('vl_knier_yc_1')
			},
			mark: true,
			init(player, storage) {
				if (!player.hasStorage('vl_knier_yc_1')) player.setStorage('vl_knier_yc_1', '')
			},
			intro: {
				markcount() {
					return 0
				},
				mark(dialog, storage, player) {
					let str
					if (player.getStorage('vl_knier_yc_1', '') == 'Use') {
						str = '出牌'
					} else if (player.getStorage('vl_knier_yc_1', '') == 'Judge') {
						str = '判定'
					} else if (player.getStorage('vl_knier_yc_1', '') == 'Discard') {
						str = '弃牌'
					} else {
						str = '摸牌'
					}
					dialog.addText("跳过下个" + str + "阶段");
				},
			},
			sub: true,
		},
	},
    t: {
        name: "意缠",
        info: "其他角色的准备阶段，你可以选择该角色场上的一张牌，其将此牌当【杀】对你使用。若此牌的花色是：<li>♥：其跳过下个出牌阶段<li>♦：其跳过下个摸牌阶段<li>♠：其跳过下个判定阶段<li>♣：其跳过下个弃牌阶段",
        taici: ["把你的牌，借我一会儿。", "花色不同，代价也不同。"],
    },
};
