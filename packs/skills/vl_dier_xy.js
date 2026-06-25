import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToTargeted",
    },
    forced: true,
    filter: function (event, player) {
					return event.card.name == 'sha'
				},
    content: function () {
					for (var i = 0; i < trigger.targets.length; i++) {
						player.gainPlayerCard(trigger.targets[i], 1, true)
					}
				},
    t: {
        name: "夕炎",
        info: "锁定技，当你使用【杀】指定目标后，你获得该角色的一张牌。",
    },
};
