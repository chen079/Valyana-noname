import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageAfter",
    },
    filter(event, player) {
        return event.card && event.player != player;
    },
    forced: true,
    async content(event, trigger, player) {
        let target = trigger.player;
        target.addVuff('zhongdu', player, trigger.num)
    },
    group: "vl_skery_ds_1",
    subSkill: {
        "1": {
            forced: true,
            popup: false,
            trigger: {
                player: "useCardToPlayered",
            },
            filter(event, player) {
                return event.card.name == 'sha' && get.color(event.card) == 'black';
            },
            logTarget: "target",
            async content(event, trigger, player) {
                trigger.getParent().directHit.add(trigger.target);
            },
            sub: true,
        },
    },
    t: {
        name: "毒杀",
        info: "锁定技，你的黑色【杀】不可被响应。当你对其他角色造成伤害后，你令受到伤害的角色获得X层「中毒」（X为此次伤害值）。",
        taici: ['毒刃轻吻，生路断绝。', '暗杀无需喧哗，只需精准。'],
    },
};
