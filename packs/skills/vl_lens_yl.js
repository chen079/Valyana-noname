import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin1",
    },
    check: function (event, player) {
					return get.attitude(player, event.player) < 0;
				},
    filter: function (event, card, player) {
					if (!event.cards) return false
					return !event.nature
				},
    content: function () {
					"step 0"
					event.colors = get.color(trigger.cards[0])
					event.suits = get.suit(trigger.cards[0])
					player.judge('vl_lens_yl', function (card) {
						if (get.suit(card) == event.suits) return 2.5
						if (get.color(card) == event.colors) return 1.5
						return -0.5
					})
						.judge2 = function (result) {
							return result.bool;
						};
					"step 1"
					if (result.judge > 0) {
						switch (result.color) {
							case 'red': game.setNature(trigger, 'fire');; break;
							case 'black': game.setNature(trigger, 'thunder');; break;
						}
						if (result.suit == event.suits) {
							trigger.num += 2
						}
					}
				},
    t: {
        name: "焱雷",
        info: "当你使用牌对其他角色造成无属性伤害时，你可以进行一次判定，若此牌与判定牌颜色相同：<li>若此牌为红色：将此次伤害改为火属性，<li>若此牌为黑色：将此次伤害改为雷属性，</li>且若二者花色相同，此伤害+2。",
    },
};
