import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBefore",
    },
    forced: true,
    async content(event, trigger, player) {
        trigger._triggered = null;
        trigger.notrigger = true;
    },
    t: {
        name: "速战",
        info: `锁定技，你造成的伤害均视为${get.poptip("kamidamage")}。`,
    },
};
