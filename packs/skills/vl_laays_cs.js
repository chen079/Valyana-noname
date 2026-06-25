import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterTarget: function (card, player, target) {
					if (player == target) return false;
					if (player.countCards('h') == 0) return false;
					return true;
				},
    usable: 1,
    content: function () {
					'step 0'
					event.num = 1
					'step 1'
					target.chooseBool('是否令' + get.translation(player) + '摸' + get.cnNumber(event.num) + '张牌').set('ai', function () {
						var player = _status.event.player
						var target = _status.event.target
						if (get.attitude(player, target) > 0) {
							return true
						} else {
							return false
						}
					}).set('target', player)
					'step 2'
					if (result.bool) {
						player.draw(event.num)
					} else {
						event.finish()
						return
					}
					'step 3'
					player.chooseCard('h', 2 * event.num, false).set('prompt', '是否交给' + get.translation(target) + get.cnNumber(2 * event.num) + '张手牌').set('ai', function (card) {
						var player = _status.event.player
						var target = _status.event.target
						if (get.attitude(player, target) > 0) {
							return 9 - get.value(card)
						} else {
							return -1
						}
					}).set('target', target)
					'step 4'
					if (result.bool) {
						target.gain(result.cards, player, 'giveAuto')
						event.num += 1
						event.goto(1)
					} else {
						event.finish()
						return
					}
				},
    ai: {
        result: {
            target: function (player, target) {
							return 1;
						},
            player: function (player, target) {
							return 1;
						},
        },
        order: 14,
    },
    t: {
        name: "存生",
        info: "出牌阶段限一次，你可以令一名其他角色选择是否令你摸X张牌，然后你可以交给其2X张手牌并重复此流程（X为本回合内你发动〖存生〗的次数）。",
    },
};
