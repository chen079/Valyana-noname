import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init(player) {
					player.fenfaSkill('vl_kesaya_wy')
				},
    fenfa(player) {
					return player.maxHp
				},
    trigger: {
        player: "phaseDiscardBefore",
    },
    forced: true,
    async content(event, trigger, player) {
					trigger.cancel();
				},
    mod: {
        targetEnabled(card, player, target, now) {
						if (card.name == 'sha') return false;
					},
    },
    group: ["vl_kesaya_wy_2"],
    subSkill: {
        "2": {
            trigger: {
                global: "useCard1",
            },
            forced: true,
            firstDo: true,
            filter(event, player) {
							var info = lib.card[event.card.name];
							if (event.player == player) return false;
							if (get.color(event.card) != 'black' || get.type(event.card) != 'trick') return false;
							return info.selectTarget && info.selectTarget == -1 && !info.toself;
						},
            async content(event, trigger, player) { },
            mod: {
                targetEnabled(card) {
								if ((get.type(card) == 'trick' || get.type(card) == 'delay') &&
									get.color(card) == 'black') return false;
							},
            },
            sub: true,
        },
    },
    t: {
        name: "无影",
        info: `${get.poptip("fenfa")}[maxHp, +∞)，锁定技，①你不能成为【杀】的目标；②弃牌阶段开始时，你跳过此阶段。③黑色锦囊牌对你无效。`,
    },
};
