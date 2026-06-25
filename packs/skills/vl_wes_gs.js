import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    filter(event, player) {
        return event.source && event.source != player && event.source != player.storage.vl_wes_ts[0]
    },
    frequent: true,
    check(event, player, storage) {
        return get.attitude(player, player.storage.vl_wes_ts[0])
    },
    async content(event, trigger, player) {
        for (var i = 0; i < trigger.num; i++) {
            player.storage.vl_wes_ts[0].damage(1, trigger.nature, trigger.source, 'unreal')
            game.delay(2)
        }
    },
    t: {
        name: "共死",
        info: "当你受到来源不为你与〖同生〗指定的角色的伤害时，你可以令伤害来源<font color=\"purple\">视为</font>对被〖同生〗指定的角色造成<font color=\"purple\">过</font>X次1点同属性伤害（X为此次伤害值）。",
    },
};
