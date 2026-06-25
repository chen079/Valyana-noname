import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageBegin3",
    },
    direct: true,
    filter: function (event, player) {
					return player.countCards('h') > 0
				},
    check: function (event, player) {
					if (event.player == player) return true
					if (player.countCards('h') <= 3) return false
					return true
				},
    logTarget: "player",
    content: function () {
					"step 0"
					var list1 = []
					var list2 = []
					if (player.countCards('h', { color: "red" })) {
						list1.push("弃置红色")
						list2.push("弃置一张红色牌令此伤害-1")
					}
					if (player.countCards('h', { color: "black" })) {
						list1.push("弃置黑色")
						list2.push("弃置一张黑色牌令此伤害+1")
					}
					list1.push('cancel2')
					player.chooseControl(list1).set("choiceList", list2).set('prompt', '是否对' + get.translation(trigger.player) + '发动〖覆身〗').set("ai", function () {
						if (get.attitude(player, trigger.player) > 0) {
							if (player.countCards('h', { color: 'red' }) > 0) {
								return '弃置红色'
							} else {
								return 'cancel2'
							}
						} else if (get.attitude(player, trigger.player) < 0) {
							if (player.countCards('he', { color: 'black' }) > 0) {
								return '弃置黑色'
							} else {
								return 'cancel2'
							}
						} else {
							return 'cancel2'
						}
					})
					"step 1"
					if (result.control == '弃置红色') {
						event.color = 'red'
					} else if (result.control == '弃置黑色') {
						event.color = 'black'
					} else {
						event.finish()
						return;
					}
					player.chooseToDiscard(1, 'h', true).set("filterCard", function (card) {
						return get.color(card) == event.color
					}).set("ai", function (card) {
						return 7 - get.value(card)
					})
					"step 2"
					if (get.color(result.cards) == 'red') {
						trigger.num--
					} else if (get.color(result.cards) == 'black') {
						trigger.num++
					} else {
						event.finish()
						return;
					}
				},
    t: {
        name: "覆身",
        info: "一名角色受到伤害时，你可以弃置一张红色牌令此伤害-1，或弃置一张黑色牌令此伤害+1。",
    },
};
