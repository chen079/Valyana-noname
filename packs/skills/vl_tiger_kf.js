import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageAfter",
    },
    forced: true,
    filter: function (event, player) {
					return event.nature == 'fire'
				},
    content: function () {
					player.draw()
					player.addTempSkill('vl_tiger_kf_use')
				},
    subSkill: {
        use: {
            mod: {
                targetInRange: function (card, player, target) {
								if (card.name == 'sha') return true
							},
                cardUsable: function (card, player, num) {
								if (card.name == 'sha') return Infinity
							},
            },
        },
    },
    t: {
        name: "狂放",
        info: "当有角色受到火属性伤害时，你摸一张牌且本回合你使用【杀】无距离与次数限制。",
    },
};
