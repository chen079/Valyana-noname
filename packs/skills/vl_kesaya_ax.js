import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    firstDo: true,
    trigger: {
        player: "useCard1",
    },
    init: function (player) {
					player.fenfaSkill('vl_kesaya_ax')
				},
    fenfa: function (player) {
					return [-Infinity, player.maxHp - 1]
				},
    forced: true,
    filter: function (event, player) {
					return !event.audioed && event.card.name == 'sha' && player.countUsed('sha', true) > 1 && event.getParent().type == 'phase';
				},
    content: function () {
					trigger.audioed = true;
				},
    mod: {
        cardUsable: function (card, player, num) {
						if (card.name == 'sha') return Infinity;
					},
    },
    ai: {
        directHit_ai: true,
        unequip: true,
        skillTagFilter: function (player, tag, arg) {
						if (!get.zhu(player, 'shouyue')) return false;
						if (arg && arg.name == 'sha') return true;
						return false;
					},
    },
    group: "vl_kesaya_ax_1",
    subSkill: {
        "1": {
            trigger: {
                player: "shaBegin",
            },
            forced: true,
            content: function () {
							trigger.directHit = true;
						},
            sub: true,
        },
    },
    t: {
        name: "暗袭",
        info: "「fenfa」(-∞, maxHp)，锁定技，你使用【杀】无次数限制，且不可被响应。",
    },
};
