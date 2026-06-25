import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    forced: true,
    locked: false,
    filter(event, player) {
        return event.player.hasVuff('sleep');
    },
    async content(event, trigger, player) {
        trigger.num += 1
    },
    t: {
        name: "惊觉",
        info: "你对处于「睡眠」状态的角色造成的伤害+1。",
    },
};
