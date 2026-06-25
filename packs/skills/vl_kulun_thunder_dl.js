import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    linkage: "metal",
    enable: "phaseUse",
    usable: 1,
    filterTarget: function (card, player, target) {
					return target != player
				},
    filter: function (event, player) {
					if(!game.hasPlayer(c=>c!=player)) return;
					return ((player.name1 == 'vl_kulun_metal') || (player.name2 == 'vl_kulun_metal'));
				},
    selectTarget: -1,
    content: function () {
					target.link()
				},
    ai: {
        order: 9,
        target: function (player, target) {
						if (target.isLinked()) return 1
						if (!target.isLinked()) return -1
					},
    },
    t: {
        name: "导连",
        info: "连携-金属：出牌阶段限一次，你可以令所有其他角色横置。",
    },
};
