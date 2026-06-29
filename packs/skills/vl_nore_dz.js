import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBefore",
        source: "damageBefore",
    },
    forced: true,
    popup: false,
    async content(event, trigger, player) {
        trigger.source = null
    },
    ai: {
        jueqing: true,
    },
    t: {
        name: "洞中",
        info: "你即将造成或受到的伤害均视为无来源。",
        taici: ["追到这里，也找不到源头。", "这口洞，吞掉来路。"],
    },
};
