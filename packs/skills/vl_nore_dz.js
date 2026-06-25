import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBefore",
        source: "damageBefore",
    },
    forced: true,
    popup: false,
    content: function () {
					trigger.source = null
				},
    ai: {
        jueqing: true,
    },
    t: {
        name: "洞中",
        info: "你即将造成或受到的伤害均视为无来源。",
    },
};
