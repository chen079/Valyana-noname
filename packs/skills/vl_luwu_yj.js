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
    init: function (player) {
					player.storage.vl_luwu_yj = false;
				},
    filter: function (event, player) {
					return !player.storage.vl_luwu_yj && player.countCards('h') == 0
				},
    content: function () {
					player.awakenSkill('vl_luwu_yj');
					player.storage.vl_luwu_yj = true;
					trigger.player.damage(2, 'fire', player)
				},
    t: {
        name: "业烬",
        info: "限定技，一名角色回合结束时，若你没有手牌，你可以对其造成2点火焰伤害。",
    },
};
