import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "loseHpAfter",
    },
    check: function (event, player) {
					return player.getDamagedHp > 1
				},
    filter: function (event, player) {
					return !event.player.isDying() && event.player != player && event.player.isIn();
				},
    content: function () {
					'step 0'
					player.recover()
					'step 1'
					player.draw(player.getDamagedHp())
				},
    ai: {
        result: {
            player: 1,
        },
    },
    t: {
        name: "血源",
        info: "非濒死的其他角色流失体力后，你可以回复1点体力，然后摸X张牌。（X为已损失体力值）",
    },
};
