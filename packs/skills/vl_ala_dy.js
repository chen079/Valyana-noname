import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["damageBegin"],
    },
    filter(event, player) {
        return event.source && event.num > 0 && event.source != player && event.source.isAlive()
    },
    check(event, player) {
        return get.attitude(player, event.source) < 0
    },
    async content(event, trigger, player) {
        player.line(trigger.source, 'green');
        const result = await player.chooseToDuiben(trigger.source).forResult();
        if (result.bool) {
            trigger.cancel();
            player.line(trigger.source);
            await trigger.source.damage(trigger.num, player, trigger.nature);
        }
    },
    t: {
        name: "对弈",
        info: "当你受到其他角色造成的伤害时，你可以与其进行“对策”，若你赢，你取消此次伤害，对其造成等量同属性伤害。",
    },
};
