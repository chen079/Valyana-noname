import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    unique: true,
    filter: function (event, player) {
					return player.storage.vl_hynea_cg > 0
				},
    check: function (event, player) {
					return player.storage.vl_hynea_cg > player.hp
				},
    filterTarget: function (card, player, target) {
					return player != target;
				},
    content: function () {
					'step 0'
					player.storage.vl_hynea_cg -= 1
					target.damage(1, player)
					'step 1'
					player.updateMark('vl_hynea_cg')
				},
    ai: {
        order: 9.5,
        expose: 0.2,
        result: {
            player: 1,
            target: -1,
        },
    },
    t: {
        name: "登险",
        info: "出牌阶段限一次，你可以令〖蹴功〗中[]内的数字-1（至少为0），然后对一名其他角色造成1点伤害。",
    },
};
