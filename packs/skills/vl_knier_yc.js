import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseZhunbeiBegin",
    },
    filter: function (event, player) {
					return event.player.countCards('ej') > 0 && event.player != player
				},
    check: function (event, player) {
					if (get.attitude(player, event.player) > 0 && (event.player.countCards('ej', { suit: 'spade' }) || event.player.countCards('ej', { suit: 'club' }))) return true
					if (get.attitude(player, event.player) < 0 && (event.player.countCards('ej', { suit: 'heart' }) || event.player.countCards('ej', { suit: 'diamond' }))) return true
					return false
				},
    content: function () {
					"step 0"
					player.choosePlayerCard(trigger.player, false, 'ej', '选择' + get.translation(target) + '其判定区或装备区的一张牌').set('ai', function (card) {
						var player = _status.event.player
						var target = _status.event.target
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
								case 'dimond': return Math.random;
								case 'spade': return -1;
								case 'club': return -1;
							}
						}
					}).set('target', trigger.player)
					"step 1"
					if (result.bool) {
						var card = result.cards[0];
						var cardx = get.autoViewAs({ name: 'sha' }, [card]);
						var target = trigger.player
						target.useCard(cardx, [card], player, false);
						switch (get.suit(card)) {
							case 'heart':
								target.skip('phaseUse');
								target.addTempSkill('vl_knier_yc_1', { player: 'phaseUseSkipped' })
								target.storage.vl_knier_yc_1 = 'Use'; break;
							case 'diamond':
								target.skip('phaseDraw');
								target.addTempSkill('vl_knier_yc_1', { player: 'phaseDrawSkipped' })
								target.storage.vl_knier_yc_1 = 'Draw'; break;
							case 'spade':
								target.skip('phaseJudge');
								target.addTempSkill('vl_knier_yc_1', { player: 'phaseJudgeSkipped' })
								target.storage.vl_knier_yc_1 = 'Judge'; break;
							case 'club':
								target.skip('phaseDiscard');
								target.addTempSkill('vl_knier_yc_1', { player: 'phaseDiscardSkipped' })
								target.storage.vl_knier_yc_1 = 'Discard'; break;
						}
						target.markSkill('vl_knier_yc_1')
					}
				},
    subSkill: {
        "1": {
            onremove: function (player) {
							player.unmarkSkill('vl_knier_yc_1')
						},
            mark: true,
            init: function (player, storage) {
							if (!player.storage.vl_knier_yc_1) player.storage.vl_knier_yc_1 = ''
						},
            intro: {
                markcount: function () {
								return 0
							},
                mark: function (dialog, storage, player) {
								var str
								if (player.storage.vl_knier_yc_1 == 'Use') {
									str = '出牌'
								} else if (player.storage.vl_knier_yc_1 == 'Judge') {
									str = '判定'
								} else if (player.storage.vl_knier_yc_1 == 'Discard') {
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
    },
};
