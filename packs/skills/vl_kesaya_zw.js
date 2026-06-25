import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filter: function (event, player) {
					return player.isHealthy();
				},
    forced: true,
    content: function () {
					player.loseHp()
					player.draw(3)
				},
    ai: {
        basic: {
            order: 1,
        },
        result: {
            player: function (player) {
							if (player.countCards('hs', 'tao') >= 1) return 1;
							return -1;
						},
        },
    },
    group: "vl_kesaya_zw_1",
    subSkill: {
        "1": {
            forced: true,
            trigger: {
                player: ["gameDrawAfter", "changeHp", "loseMaxHp", "gainMaxHp"],
            },
            filter: function (event, player) {
							return player.maxHp != 2
						},
            content: function () {
							player.maxHp = 2
							player.update()
						},
            sub: true,
        },
    },
    t: {
        name: "祭献",
        info: "你的体力上限始终等于2；出牌阶段，若你未受伤，你可以失去1点体力并摸三张牌。",
    },
};
