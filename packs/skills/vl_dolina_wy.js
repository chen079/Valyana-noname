import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    forced: true,
    filter(event, player) {
					return event.source && event.num > 0
				},
    async content(event, trigger, player) {
        var card = get.cards()[0];
        await player.showCards(card, get.translation(player) + '发动了【威仪】')
        var eff = get.damageEffect(player, trigger.source, trigger.source, trigger.nature)
        					const result = await trigger.source.chooseToDiscard('he', '请弃置一张' + get.translation(get.type2(card)) + '牌，否则取消此次伤害', function (cardx) {
        						return get.type2(cardx) == get.type2(card)
        					}).set('ai', function (card) {
        						if (_status.event.eff > 0) {
        							return 10 - get.value(card);
        						}
        						return 0;
        					}).set('eff', eff).forResult();
        if (!result.bool) {
        						trigger.cancel()
        					}
        					await player.loseToDiscardpile(card)
    },
    t: {
        name: "威仪",
        info: "锁定技，当你受到一名角色造成的伤害时，你亮出牌堆顶的一张牌，然后其须弃置与此牌类型相同的一张牌，否则其取消此次伤害。",
    },
};
