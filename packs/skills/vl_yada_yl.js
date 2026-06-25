import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageBegin1",
    },
    forced: true,
    filter: function (event, player) {
					return event.source && event.source.isIn() && event.player.isIn() && event.player.countCards('h') > 0
				},
    content: function () {
					'step 0'
					trigger.source.choosePlayerCard('h', trigger.player, true);
					'step 1'
					var card = result.cards[0];
					trigger.player.showCards(card);
					if (get.color(card) == 'black') {
						trigger.player.discard(card);
						trigger.cancel();
					}
				},
    t: {
        name: "夜临",
        info: "锁定技，有角色对另一名角色造成伤害时，展示其一张手牌；若为黑色则防止伤害并弃置之。",
    },
};
