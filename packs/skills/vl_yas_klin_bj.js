import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forbid: ["boss"],
    trigger: {
        player: "die",
    },
    forced: true,
    forceDie: true,
    skillAnimation: true,
    animationColor: "gray",
    filter(event, player) {
        return event.source && event.source.isIn();
    },
    async content(event, trigger, player) {
        trigger.source.discard(trigger.source.getCards('he'))
        trigger.source.loseHp(trigger.source.hp)
    },
    logTarget: "source",
    ai: {
        threaten(player, target) {
            if (target.hp == 1) return 0.2;
            return 1.5;
        },
        effect: {
            target(card, player, target, current) {
                if (!target.hasFriend()) return;
                if (target.hp <= 1 && get.tag(card, 'damage')) return [1, 0, 0, -2];
            },
        },
    },
    t: {
        name: "怖惧",
        info: "锁定技，杀死你的角色弃置所有牌并失去所有体力。",
        taici: ["活着的人，先怕吧。", "杀我的代价，你付得起么。"],
    },
};
