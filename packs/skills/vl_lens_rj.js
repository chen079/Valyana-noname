import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    filter(event, player) {
					return (player.isLinked() ? '' : 'n')
				},
    trigger: {
        source: "damageBefore",
    },
    async content(event, trigger, player) {
					trigger.player.link(true)
				},
    ai: {
        effect: {
            target(card) {
							if (card.name == 'tiesuo') return 'zeroplayertarget';
						},
        },
    },
    subSkill: {
        "1": {
            trigger: {
                player: "linkBegin",
            },
            forced: true,
            filter(event, player) {
							return !player.isLinked();
						},
            async content(event, trigger, player) {
							trigger.cancel();
						},
            sub: true,
        },
    },
    t: {
        name: "衽接",
        info: "锁定技，你即将造成伤害时，受到伤害的角色进入连环状态；当你进入连环状态时，取消之。",
    },
};
