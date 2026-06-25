import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    trigger: {
        global: "dying",
    },
    mark: true,
    skillAnimation: false,
    animationStr: "献生",
    limited: true,
    animationColor: "orange",
    init(player) {
        player.storage.vl_mountainbear_xs = false;
    },
    filter(event, player) {
        if (!player.storage.vl_lucifer_cc || player.storage.vl_mountainbear_xs) return false;
        if (player.storage.vl_lucifer_cc != event.player) return false;
        return true;
    },
    content: async function content(event, trigger, player) {
        player.awakenSkill('vl_mountainbear_xs')
        const target = trigger.player;
        if (player.getCards('he').length) await player.give(player.getCards('he'), target).forResult();
        const num = player.hp - target.hp;
        await target.recover(num);
        await player.loseHp(num);
    },
    ai: {
        order: 1,
        skillTagFilter(player) {
            if (player.storage.vl_lucifer_cc.maxHp <= 1) return false;
            if (player.storage.vl_lucifer_cc.hp > 0) return false;
            if (player.storage.vl_lucifer_cc.countCards('h') == 0) return false;
        },
        save: true,
        result: {
            player: 1,
        },
        threaten: 2,
    },
    t: {
        name: "献生",
        info: "限定技，当你的“契主”进入濒死状态时，你可以发动此技能：交给其所有牌并令其回复体力至与你相同，然后你失去等量体力。",
    },
};
