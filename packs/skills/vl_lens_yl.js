import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin1",
    },
    check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
    filter(event, card, player) {
					if (!event.cards) return false
					return !event.nature
				},
    async content(event, trigger, player) {
					const colors = get.color(trigger.cards[0]);
					const suits = get.suit(trigger.cards[0]);
					const next = player.judge('vl_lens_yl', function (card) {
						if (get.suit(card) == suits) return 2.5;
						if (get.color(card) == colors) return 1.5;
						return -0.5;
					});
					next.judge2 = function (result) {
						return result.bool;
					};
					const result = await next.forResult();
					if (result.judge > 0) {
						if (result.color == 'red') game.setNature(trigger, 'fire');
						if (result.color == 'black') game.setNature(trigger, 'thunder');
						if (result.suit == suits) {
							trigger.num += 2;
						}
					}
				},
    t: {
        name: "焱雷",
        info: "当你使用牌对其他角色造成无属性伤害时，你可以进行一次判定，若此牌与判定牌颜色相同：<li>若此牌为红色：将此次伤害改为火属性，<li>若此牌为黑色：将此次伤害改为雷属性，</li>且若二者花色相同，此伤害+2。",
    },
};
