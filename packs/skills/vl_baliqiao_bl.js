import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "gainBegin",
    },
    forced: true,
    filter(event, player) {
					return _status.currentPhase != player
				},
    async content(event, trigger, player) {
        trigger.gaintag.add('vl_baliqiao_bl');
    },
    mod: {
        ignoredHandcard(card, player) {
						if (card.hasGaintag('vl_baliqiao_bl')) {
							return true;
						}
					},
        cardDiscardable(card, player, name) {
						if (name == 'phaseDiscard' && card.hasGaintag('vl_baliqiao_bl')) {
							return false;
						}
					},
    },
    t: {
        name: "博览",
        info: "锁定技，你于回合外获得的牌不计入手牌上限。",
    },
};
