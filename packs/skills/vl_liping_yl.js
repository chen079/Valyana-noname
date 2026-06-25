import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageEnd",
    },
    filter: function (event, player) {
					return event.card && event.notLink()
				},
    direct: true,
    content: function () {
					'step 0'
					if (player.getCards('he').some(card => get.type2(card) == get.type2(trigger.card))) {
						player.chooseToDiscard('he', get.prompt2('vl_liping_yl'), function (card) {
							return get.type2(card) == get.type2(trigger.card)
						}).set('ai', function (card) {
							if (get.attitude(player, trigger.player) < 0) {
								return -1
							} else {
								return 7 - get.value(card)
							}
						})
					} else {
						player.gain(get.cardPile(card => get.type2(card) == get.type2(trigger.card)))
						event.finish()
					}
					'step 1'
					if (result.bool) {
						trigger.player.recover()
					}
				},
    t: {
        name: "药理",
        info: "当一名角色受到因牌造成的伤害后：<li>1.你可以弃置一张与伤害牌同类型的牌，并令其回复1点体力，<li>2.若你没有同类型牌，你从牌堆中获得一张同类型牌。",
    },
};
