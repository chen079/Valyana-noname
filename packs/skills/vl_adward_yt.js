import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mark: true,
    zhuanhuanji: true,
    enable: "phaseUse",
    usable: 1,
    init: function (player, storage) {
					if (!player.storage.vl_adward_yt) player.storage.vl_adward_yt = false
				},
    intro: {
        content: function (storage, player, skill) {
						if (player.storage.vl_adward_yt == true) return '你可令一名体力值最多的角色将体力值失去至与体力值最少的角色相同';
						return '你可令一名体力值最少的角色将体力值回复至与体力值最多的角色相同';
					},
    },
    filter: function (event, player) {
					if (player.storage.vl_adward_yt == true) {
						return game.findPlayer(function (current) {
							return current.isMaxHp() && !current.isMinHp()
						})
					} else {
						return game.findPlayer(function (current) {
							return current.isMinHp() && !current.isMaxHp() && current.hp != current.maxHp
						})
					}
				},
    filterTarget: function (card, player, target, skill) {
					if (player.storage.vl_adward_yt == true) {
						return target.isMaxHp() && !target.isMinHp()
					} else {
						return target.isMinHp() && !target.isMaxHp() && target.hp != target.maxHp
					}
				},
    content: function () {
					if (player.storage.vl_adward_yt == false) {
						var ones = game.filterPlayer(function (current) {
							return current.isMaxHp()
						})
						var num = Math.min(3, ones[0].hp - target.hp)
						target.recover(num);
					} else {
						var ones = game.filterPlayer(function (current) {
							return current.isMinHp()
						})
						var num = Math.min(3, target.hp - ones[0].hp)
						target.loseHp(num);
					}
					player.changeZhuanhuanji('vl_adward_yt')
				},
    ai: {
        order: 14,
        result: {
            target: function (player, target, storage) {
							if (player.storage.vl_adward_yt) {
								var ones = game.filterPlayer(function (current) {
									return current.isMinHp()
								})
								var num = Math.min(3, Math.abs(ones[0].hp - target.hp))
								return -2 * num
							} else {
								var ones = game.filterPlayer(function (current) {
									return current.isMaxHp()
								})
								var num = Math.min(3, Math.abs(target.hp - ones[0].hp))
								return 2 * num
							}
						},
        },
    },
    t: {
        name: "咏叹",
        info: "转换技，出牌阶段限一次，<li>阳：你可以令一名体力值最少的角色将体力值回复至与体力值最多的角色相等。<li>阴：你可以令一名体力值最多的角色将体力值失去至与体力值最少的角色相等。</li>（最多回复/失去3点体力）。",
    },
};
