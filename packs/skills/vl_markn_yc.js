import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					var marks = player.getExpansions('vl_markn_yz').length
					return marks > 0 && game.hasPlayer(current => current != player && current.countCards('h') <= Math.ceil(marks / 2))
				},
    filterTarget: function (card, player, target) {
					var marks = player.getExpansions('vl_markn_yz').length
					return target != player && target.countCards('h') <= Math.ceil(marks / 2)
				},
    content: function () {
					"step 0"
					var marks = player.getExpansions('vl_markn_yz').length
					var changenum = Math.ceil(marks / 2)
					player.chooseCardButton('选择将' + get.cnNumber(changenum) + '张“视”置入弃牌堆，然后与一名手牌数小于' + get.cnNumber(changenum) + '的角色交换手牌', changenum, player.getExpansions('vl_markn_yz'))
					"step 1"
					if (result.bool) {
						player.loseToDiscardpile(result.links)
						player.swapHandcards(target);
					} else {
						event.finish()
						return;
					}
				},
    ai: {
        order: 1,
        result: {
            player: function (player, target) {
							var cards = player.getExpansions('vl_markn_yz')
							if (cards.length < 3) return 0;
							if (target.countCards('h') > 0) return -Math.max(get.value(target.getCards('h'), player) - get.value(player.getCards('h'), player), 0);
							return 0;
						},
        },
    },
    t: {
        name: "易策",
        info: "出牌阶段限一次，你可以将X张“视”置入弃牌堆，然后与一名手牌数不大于X的角色交换手牌（X为你“视”数量的一半并向上取整）。",
    },
};
