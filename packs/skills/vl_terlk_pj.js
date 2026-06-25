import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    forced: true,
    filter(event, player) {
					return event.card.name == 'sha' && !event.getParent().directHit.includes(event.target);
				},
    logTarget: "target",
    async content(event, trigger, player) {
					var id = trigger.target.playerid;
					var map = trigger.getParent().customArgs;
					if (!map[id]) map[id] = {};
					if (typeof map[id].shanRequired == 'number') {
						map[id].shanRequired += trigger.target.hp - 1;
					}
					else {
						map[id].shanRequired = trigger.target.hp;
					}
				},
    ai: {
        directHit_ai: true,
        skillTagFilter(player, tag, arg) {
						if (arg.card.name != 'sha' || arg.target.countCards('h', 'shan') > arg.target.getDamagedHp()) return false;
					},
    },
    t: {
        name: "披荆",
        info: "锁定技，当你使用【杀】指定目标后，你令此牌需要依次使用或打出X张【闪】响应（X为目标角色的体力值）。",
    },
};
