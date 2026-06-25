import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    filter(event, player) {
					return event.player.isAlive() && event.player.countCards('he') > 0
				},
    check(event, player) {
					return get.attitude(player, event.player) < 0
				},
    async content(event, trigger, player) {
					player.discardPlayerCard(trigger.player, 'he', 2, true)
				},
    t: {
        name: "寒霜",
        info: "当你造成伤害后，你可以弃置受伤害角色的两张牌。",
    },
};
