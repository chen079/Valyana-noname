import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageAfter",
    },
    firstDo: true,
    filter: function (event, player) {
					return event.source && event.source != player
				},
    frequent: true,
    locked: true,
    content: function () {
					'step 0'
					player.draw(trigger.num)
					'step 1'
					var list = ['red', 'black']
					player.chooseControl(list, 'cancel2').set('ai', function () {
						return list.randomGet()
					}).set('prompt', get.prompt2('vl_kamijia_dr'))
					'step 2'
					if (result.control != 'cancel2') {
						player.popup(get.translation(result.control))
						player.judge('vl_kamijia_dr', function (card) {
							return (get.color(card) == result.control) ? 2 : -1
						}).judge2 = function (result) {
							return result.bool;
						};
					} else {
						event.finish()
					}
					'step 3'
					if (result.judge > 0) {
						player.recover(trigger.num)
					}
				},
    t: {
        name: "夺刃",
        info: "锁定技，当你受到伤害结算完毕后，你可以摸X张牌（X为此次伤害值），然后你可以声明一种颜色并进行判定，若判定牌与你声明的颜色相同，你回复等同于此次伤害值的体力。",
    },
};
