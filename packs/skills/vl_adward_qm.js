import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["phaseUseBegin", "phaseJieshuBegin"],
    },
    direct: true,
    filter: function (event, player) {
					var str
					if (event.name == 'phaseUse') {
						str = 'red'
					} else {
						str = 'black'
					}
					return player.countCards('h', { color: str }) > 0
				},
    content: function () {
					'step 0'
					var str
					if (trigger.name == 'phaseUse') {
						str = 'red'
					} else {
						str = 'black'
					}
					event.color = str
					'step 1'
					var cards = player.getCards('h')
					player.logSkill("vl_adward_qm")
					player.recast(cards.filter(card => get.color(card) == event.color))
					'step 2'
					if (player.countCards('h', { color: event.color }) > 0) {
						event.goto(1)
					}
				},
    t: {
        name: "千面",
        info: "出牌阶段开始时，你重铸手牌中的所有红色牌，直至没有红色牌；结束阶段，你重铸你手牌中的所有黑色牌，直至没有黑色牌。",
    },
};
