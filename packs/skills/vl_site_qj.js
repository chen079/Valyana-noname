import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    check(event, player) {
					if (event.num >= 2 && player.maxHp > 0) return true;
					if (event.num >= 1 && player.maxHp > player.hp + 2) {
						return true
					} else if (player.hp == 1) {
						return true
					} else {
						return false
					}
				},
    async content(event, trigger, player) {
        trigger.cancel();
        event.lose = await player.loseMaxHp(trigger.num);
        await player.draw(trigger.num);
    },
    ai: {
        filterDamage: true,
        skillTagFilter(player, tag, arg) {
						if (arg && arg.player) {
							if (arg.player.hasSkillTag('jueqing', false, player)) return false;
						}
					},
    },
    t: {
        name: "权解",
        info: "当你受到伤害时，你可以改为失去等量体力上限，然后摸等量牌。",
    },
};
