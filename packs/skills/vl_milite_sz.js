import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "shaBegin",
    },
    forced: true,
    filter(event, player) {
					return get.distance(event.target, player, 'attack') > 1;
				},
    async content(event, trigger, player) {
					trigger.directHit = true;
				},
    t: {
        name: "重斩",
        info: "当你使用【杀】时，若你不在【杀】的目标的攻击范围内，此杀不可被响应。",
    },
};
