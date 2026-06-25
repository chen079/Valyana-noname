import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    multitarget: true,
    filterTarget: function (card, player, target) {
					if (ui.selected.targets.length) {
						return target.countCards('h') != ui.selected.targets[0].countCards('h')
					}
					return true;
				},
    filter: function (event, player) {
					if (!player.storage.vl_linyan_kr || player.storage.vl_linyan_kr == false) {
						return game.hasPlayer(function (current1) {
							return game.hasPlayer(function (current2) {
								return current1.countCards('h') != current2.countCards('h')
							})
						})
					} else {
						return game.hasPlayer(function (current) {
							return current.countCards('h') < current.hp
						})
					}
				},
    selectTarget: function () {
					var player = _status.event.player
					if (!player.storage.vl_linyan_kr || player.storage.vl_linyan_kr == false) {
						return 2
					} else {
						if (ui.selected.targets.length > ui.selected.cards.length) {
							game.uncheck('target');
						}
						return ui.selected.cards.length;
					}
				},
    usable: 1,
    check: function (target) {
					if (!player.storage.vl_linyan_kr || player.storage.vl_linyan_kr == false) {
						if (!ui.selected.targets) {
							return 1 - 2 * Math.random()
						} else {
							var num = Math.floor((ui.selected.targets[0].countCards('h') + target.countCards('h')) / 2)
							return num - target.countCards('h')
						}
					} else {
						if (target.countCards('h') < target.maxHp) return (target.maxHp - target.countCards('h'))
						return 0
					}
				},
    position: "h",
    filterCard: true,
    selectCard: function () {
					var player = _status.event.player
					if (!player.storage.vl_linyan_kr || player.storage.vl_linyan_kr == false) {
						return 0
					} else {
						return [1, game.countPlayer(function (current) {
							return current.countCards('h') < current.hp
						})]
					}
				},
    zhuanhuanji: true,
    init: function (player) {
					if (!player.storage.vl_linyan_kr) player.storage.vl_linyan_kr = false
				},
    content: function () {
					'step 0'
					if (player.storage.vl_linyan_kr == false) {
						var num = Math.floor((targets[0].countCards('h') + targets[1].countCards('h')) / 2)
						event.num = num
						for (var i = 0; i < targets.length; i++) {
							var num = targets[i].countCards('h') - event.num
							if (num > 0) {
								targets[i].chooseToDiscard('h', num, true)
							} else {
								targets[i].draw(-num)
							}
						}
					} else {
						for (var i = 0; i < targets.length; i++) {
							if (targets[i].countCards('h') < targets[i].maxHp) {
								targets[i].draw(Math.min((targets[i].maxHp - targets[i].countCards('h')), 5))
							}
						}
					}
					'step 1'
					player.changeZhuanhuanji('vl_linyan_kr')
				},
    ai: {
        order: 14,
        player: 1,
        target: function (player, target, card) {
						if (!player.storage.vl_linyan_kr || player.storage.vl_linyan_kr == false) {
							if (!ui.selected.targets) {
								return 1 - 2 * Math.random()
							} else {
								var num = Math.floor((ui.selected.targets[0].countCards('h') + target.countCards('h')) / 2)
								return num - target.countCards('h')
							}
						} else {
							if (target.countCards('h') < target.maxHp) return (target.maxHp - target.countCards('h'))
							return 0
						}
					},
    },
    t: {
        name: "枯荣",
        info: "转换技，出牌阶段限一次，阳：你可以选择两名手牌数不相等角色，令其将手牌数调整至二者手牌数的平均值（向下取整），阴：你可以弃置至多X张手牌并选择等量角色（X为场上手牌数小于体力值的角色数），令这些角色将手牌数摸至体力上限（至多摸五张）。",
    },
};
