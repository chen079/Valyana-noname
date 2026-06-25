import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "useCardAfter",
    },
    direct: true,
    filter(event, player) {
					if (event.targets.length != 1) return false;
					if (event.targets[0] == event.player) return false
					if (player.countCards('hs') <= 0) return false
					var cards = player.getCards('hs')
					var bool = false
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i]
						if (player.canUse(card, event.targets[0]) && lib.filter.targetEnabled2(card, player, event.targets[0]) && lib.filter.targetInRange(card, player, event.targets[0])) {
							bool = true
							break
						}
					}
					return bool && player != _status.currentPhase && event.player != player && event.targets[0].isAlive()
				},
    async content(event, trigger, player) {
					var cards = player.getCards('hs');
					var bool = false;
					for (var i = 0; i < cards.length; i++) {
						var card = cards[i];
						if (player.canUse(card, trigger.targets[0]) && lib.filter.targetEnabled2(card, player, trigger.targets[0]) && lib.filter.targetInRange(card, player, trigger.targets[0])) {
							bool = true;
							break;
						}
					}
					if (!trigger.targets[0].isAlive() || !bool) return;
					const result = await player.chooseToUse(function (card) {
						return player.canUse(card, trigger.targets[0], false) && !get.info(card)?.multitarget && lib.filter.targetEnabled2(card, player, trigger.targets[0]) && lib.filter.targetInRange(card, player, trigger.targets[0]);
					}, '是否对' + get.translation(trigger.targets[0] == player ? '自己' : trigger.targets[0]) + '使用一张牌，然后摸两张牌。', trigger.targets[0], -1).forResult();
					if (result.bool) {
						await player.draw(2);
					}
				},
    t: {
        name: "炎势",
        info: "你的回合外，当一名其他角色对另一名角色使用牌结算完毕后，若此牌有唯一目标，你可以对目标角色使用一张牌并摸两张牌。",
    },
};
