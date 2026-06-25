import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    filter: function (event, player) {
					return player.isPhaseUsing()
				},
    forced: true,
    locked: false,
    content: function () {
					player.addTempSkill('vl_zenia_ld_2');
					player.addMark('vl_zenia_ld_2', 1, false);
				},
    subSkill: {
        "2": {
            onremove: true,
            intro: {
                content: "手牌上限+#",
            },
            mod: {
                maxHandcard: function (player, num) {
								return num + player.countMark('vl_zenia_ld_2');
							},
            },
            sub: true,
        },
    },
    t: {
        name: "律动",
        info: "锁定技，出牌阶段，你使用牌时，你本回合的手牌上限+1。",
    },
};
