import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    forced: true,
    filter: function (event, player) {
					return event.source && event.num > 0
				},
    content: function () {
					'step 0'
					var card = get.cards()[0];
					event.card = card;
					player.showCards(card, get.translation(player) + '发动了【威仪】')
					'step 1'
					var eff = get.damageEffect(player, trigger.source, trigger.source, trigger.nature)
					trigger.source.chooseToDiscard('he', '请弃置一张' + get.translation(get.type2(event.card)) + '牌，否则取消此次伤害', function (card) {
						return get.type2(card) == get.type2(event.card)
					}).set('ai', function (card) {
						if (_status.event.eff > 0) {
							return 10 - get.value(card);
						}
						return 0;
					}).set('eff', eff);
					'step 2'
					if (!result.bool) {
						trigger.cancel()
					}
					player.loseToDiscardpile(card)
				},
    t: {
        name: "威仪",
        info: "锁定技，当你受到一名角色造成的伤害时，你亮出牌堆顶的一张牌，然后其须弃置与此牌类型相同的一张牌，否则其取消此次伤害。",
    },
};
