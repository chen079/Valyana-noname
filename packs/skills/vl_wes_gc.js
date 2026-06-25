import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    logTarget: "source",
    preHidden: true,
    filter: function (event, player) {
					return (event.source && event.source.countGainableCards(player, 'he') && event.num > 0 && event.source != player);
				},
    content: function () {
					player.gainPlayerCard(true, trigger.source, 'he');
				},
    ai: {
        maixie_defend: true,
        effect: {
            target: function (card, player, target) {
							if (player.countCards('he') > 1 && get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
								if (get.attitude(target, player) < 0) return [1, 1];
							}
						},
        },
    },
    t: {
        name: "反馈",
        info: "当你受到伤害后，你可以获得伤害来源的一张牌。",
    },
};
