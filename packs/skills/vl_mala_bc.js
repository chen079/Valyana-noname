import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: ["vl_mala_bc_begin", "vl_mala_bc_draw", "vl_mala_bc_use", "vl_mala_bc_discard", "vl_mala_bc_end"],
    trigger: {
        player: "turnOverBegin",
    },
    firstDo: true,
    content: function () {
					trigger.cancel()
				},
    ai: {
        noCompareTarget: true,
    },
    subSkill: {
        begin: {
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            forced: true,
            popup: false,
            content: function () {
							player.storage.vl_mala_bc_draw = true;
							player.storage.vl_mala_bc_use = true;
						},
            sub: true,
        },
        draw: {
            trigger: {
                player: "phaseDrawBegin",
            },
            forced: true,
            popup: false,
            content: function () {
							player.storage.vl_mala_bc_draw = false;
						},
            sub: true,
        },
        use: {
            trigger: {
                player: "phaseUseBegin",
            },
            forced: true,
            popup: false,
            content: function () {
							player.storage.vl_mala_bc_use = false;
						},
            sub: true,
        },
        discard: {
            trigger: {
                player: "phaseDiscardBefore",
            },
            forced: true,
            filter: function (event, player) {
							if (player.storage.vl_mala_bc_use) return true;
							return false;
						},
            content: function () {
							trigger.cancel();
						},
            sub: true,
        },
        end: {
            trigger: {
                player: "phaseJieshuBegin",
            },
            forced: true,
            filter: function (event, player) {
							if (player.storage.vl_mala_bc_draw) return true;
							return false;
						},
            content: function () {
							player.draw(3);
						},
            sub: true,
        },
    },
    t: {
        name: "不摧",
        info: "锁定技，你无法成为翻面或拼点的目标，若你的出牌阶段被跳过，你跳过本回合的弃牌阶段；若你的摸牌阶段被跳过，结束阶段开始时，你摸三张牌。",
    },
};
