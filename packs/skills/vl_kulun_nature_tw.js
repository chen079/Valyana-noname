import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    linkage: "thunder",
    filterTarget: function (card, player, target) {
					return target != player
				},
    check: function (target) {
					var player = _status.event.player
					return -get.attitude(player, target)
				},
    filter: function (event, player) {
					return ((player.name1 == 'vl_kulun_thunder') || (player.name2 == 'vl_kulun_thunder'));
				},
    content: function () {
					'step 0'
					var cards = game.getInCenter()
					event.num = cards.filter(i => get.color(i) == 'black').length
					'step 1'
					target.executeDelayCardEffect('shandian')
					'step 2'
					event.num--
					if (event.num > 0) {
						event.goto(1)
					}
				},
    ai: {
        order: 4,
        result: {
            target: -5,
        },
    },
    t: {
        name: "天威",
        info: "连携-雷电：出牌阶段限一次，你可以令一名角色进行X次闪电判定（X为「center」黑色牌数）。",
    },
};
