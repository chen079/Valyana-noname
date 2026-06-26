import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        targetEnabled(card) {
            if ((get.type2(card) == 'trick' && get.color(card) == 'black') || get.type(card) == 'delay') return false;
        },
    },
    trigger: {
        player: "damageBegin3",
    },
    forced: true,
    filter(event, player) {
        return player == _status.currentPhase;
    },
    async content(event, trigger, player) {
        trigger.cancel();
        let num = trigger.num;
        player.draw(2 * num);
    },
    ai: {
        effect: {
            target(card, player, target) {
                if (target == _status.currentPhase && get.tag(card, 'damage')) return [0, 1];
            },
        },
    },
    t: {
        name: "垂帘",
        info: "锁定技。①你不能成为延时类锦囊牌与黑色普通锦囊牌的目标，②当你于回合内受到伤害时，你防止此伤害并摸2X张牌（X为伤害值）。",
    },
};
