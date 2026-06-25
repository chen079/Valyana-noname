import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    filter(event, player) {
					return event.nature == 'fire' && ((player.name1 == 'vl_kulun_wind') || (player.name2 == 'vl_kulun_wind'));
				},
    linkage: "wind",
    async content(event, trigger, player) {
        const result = await player.chooseToDiscard('he', get.prompt('vl_kulun_fire_fz'), '弃置一张牌并移动场上的一张牌', lib.filter.cardDiscardable).set('ai', function (card) {
            if (!_status.event.check) return 0;
            return 7 - get.value(card);
        }).set('check', player.canMoveCard(true)).set('logSkill', 'vl_kulun_fire_fz').forResult();
        if (!result.bool) return;
        await player.moveCard(true);
    },
    t: {
        name: "风助",
        info: "连携-飓风：当你造成火焰伤害时，你可以弃置一张牌，然后移动场上的一张牌。",
    },
};
