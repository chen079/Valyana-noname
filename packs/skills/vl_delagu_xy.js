import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "loseHpAfter",
    },
    check(event, player) {
					return player.getDamagedHp > 1
				},
    filter(event, player) {
					return !event.player.isDying() && event.player != player && event.player.isIn();
				},
    async content(event, trigger, player) {
        await player.recover();
        await player.draw(player.getDamagedHp());
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
