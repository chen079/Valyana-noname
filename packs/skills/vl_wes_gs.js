import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    filter(event, player) {
        const target = player.getStorage('vl_wes_ts', [])[0];
        return event.source && event.source != player && target && event.source != target
    },
    frequent: true,
    check(event, player, storage) {
        const target = player.getStorage('vl_wes_ts', [])[0];
        return target ? get.attitude(player, target) : 0
    },
    async content(event, trigger, player) {
        const target = player.getStorage('vl_wes_ts', [])[0];
        if (!target) return;
        for (let i = 0; i < trigger.num; i++) {
            target.damage(1, trigger.nature, trigger.source, 'unreal')
            game.delay(2)
        }
    },
    t: {
        name: "共死",
        info: `当你受到来源不为你与${get.poptip("vl_wes_ts")}指定的角色的伤害时，你可以令伤害来源<font color=\"purple\">视为</font>对被${get.poptip("vl_wes_ts")}指定的角色造成<font color=\"purple\">过</font>X次1点同属性伤害（X为此次伤害值）。`,
    },
};
