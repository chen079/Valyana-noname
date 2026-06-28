import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseJieshuBegin",
    },
    unique: true,
    mark: true,
    skillAnimation: true,
    limited: true,
    animationColor: "orange",
    init(player) {
        player.setStorage('vl_luwu_yj', false);
    },
    filter(event, player) {
        return !player.getStorage('vl_luwu_yj', false) && player.countCards('h') == 0
    },
    async content(event, trigger, player) {
        player.awakenSkill('vl_luwu_yj');
        player.setStorage('vl_luwu_yj', true);
        trigger.player.damage(2, 'fire', player)
    },
    t: {
        name: "业烬",
        info: "限定技，一名角色回合结束时，若你没有手牌，你可以对其造成2点火焰伤害。",
    },
};
