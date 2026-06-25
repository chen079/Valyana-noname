import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseUseBegin",
    },
    direct: true,
    content: function () {
					'step 0'
					player.chooseTarget(1, get.prompt2('vl_guotang_xq'), function (card, player, target) {
						return target != player
					}).set('ai', function (target) {
						var player = _status.event.player
						var att = get.attitude(player, target)
						return att
					})
					'step 1'
					if (result.bool) {
						var choice = [], choiceList = []
						event.target = result.targets[0]
						if (player.countCards('h') > 0) {
							choiceList.push('令' + get.translation(player) + '交给你一张牌')
							choice.push('拿牌')
						}
						if (event.target.countCards('h') > 0) {
							choiceList.push('交给不为' + get.translation(player) + '的其他角色一张牌，若你因此失去最后一张手牌，则' + get.translation(player) + '可令一名角色摸两张牌')
							choice.push('给牌')
						}
						if (!choice.length) return event.finish()
						event.target.chooseControl(choice).set('choiceList', choiceList)
							.set('ai', function () {
								var player = _status.event.player
								var target = _status.event.target
								if (choice.length == 1) {
									return choice[0]
								}
								if (get.attitude(player, target) < 0) {
									return '拿牌'
								} else {
									if (player.countCards('h') == 1) {
										return '给牌'
									} else if (target.countCards('h') > 3 && player.countCards('h') <= 2) {
										return '拿牌'
									} else {
										return '给牌'
									}
								}
							}).set('target', player)
					} else {
						event.finish()
					}
					'step 2'
					if (result.control == '拿牌') {
						player.chooseCard('he', 1, true, '交给' + get.translation(event.target) + '一张牌')
					} else {
						event.goto(4)
					}
					'step 3'
					event.target.gain(result.cards, 'giveAuto', player)
					event.finish()
					'step 4'
					event.target.chooseCardTarget({
						filterTarget: function (card, player, target) {
							var source = _status.event.source
							return event.target != target && source != target;
						},
						position: 'he',
						ai1: function (card) {
							return 100 - get.value(card);
						},
						forced: true,
						ai2: function (target) {
							return get.attitude(event.target, target)
						},
						prompt: '交给一名不为' + get.translation(player) + '的其他角色一张牌',
					}).set('source', player)
					'step 5'
					event.target.give(result.cards, result.targets[0])
					'step 6'
					if (event.target.countCards('h') == 0) {
						player.chooseTarget('令一名角色摸两张牌', 1).set('ai', function (target) {
							var player = _status.event.player
							return get.attitude(player, target)
						})
					} else {
						event.finish()
					}
					'step 7'
					if (result.bool) {
						result.targets[0].draw(2)
					}
				},
    t: {
        name: "系群",
        info: "出牌阶段开始时，你可以选择一名其他角色，其选择一项：1.你交给其一张牌，2.其交给另一名其他角色一张牌，若其因此失去最后一张手牌，则你可令一名角色摸两张牌。",
    },
};
