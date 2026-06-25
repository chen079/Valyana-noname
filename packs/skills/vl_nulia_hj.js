import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin2",
    },
    frequent: true,
    filter: function (event, player) {
					return !event.numFixed;
				},
    content: function () {
					var num = 2
					if (get.mode() == 'identity') {
						if (player.identity == 'zhu') {
							num = game.countPlayer(function (current) {
								return current.identity == 'zhong' || current.identity == 'mingzhong';
							});
						} else {
							num = game.countPlayer(function (current) {
								return current.identity == player.identity;
							});
						}
					}
					trigger.num += num
				},
    ai: {
        threaten: 1.3,
    },
    group: "vl_nulia_hj_2",
    subSkill: {
        "2": {
            mod: {
                maxHandcardBase: function (player, num) {
								return player.maxHp;
							},
            },
            sub: true,
        },
    },
    t: {
        name: "合击",
        info: "你的手牌上限等于你的体力上限；摸牌阶段，你可以多摸X张牌（若你为主公，X为场上忠臣数；否则X为场上与你同身份的角色数）。",
    },
};
