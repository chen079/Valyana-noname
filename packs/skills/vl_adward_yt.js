import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mark: true,
    zhuanhuanji: true,
    enable: "phaseUse",
    usable: 1,
    init(player, storage) {
					if (!player.storage.vl_adward_yt) player.storage.vl_adward_yt = false
				},
    intro: {
        content(storage, player, skill) {
						if (player.storage.vl_adward_yt == true) return '你可令一名体力值最多的角色将体力值失去至与体力值最少的角色相同';
						return '你可令一名体力值最少的角色将体力值回复至与体力值最多的角色相同';
					},
    },
    filter(event, player) {
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
    filterTarget(card, player, target, skill) {
					if (player.storage.vl_adward_yt == true) {
						return target.isMaxHp() && !target.isMinHp()
					} else {
						return target.isMinHp() && !target.isMaxHp() && target.hp != target.maxHp
					}
				},
    async content(event, trigger, player) {
					const target = event.target;
					if (player.storage.vl_adward_yt == false) {
						const ones = game.filterPlayer(function (current) {
							return current.isMaxHp()
						})
						const num = Math.min(3, ones[0].hp - target.hp)
						await target.recover(num);
					} else {
						const ones = game.filterPlayer(function (current) {
							return current.isMinHp()
						})
						const num = Math.min(3, target.hp - ones[0].hp)
						await target.loseHp(num);
					}
					player.changeZhuanhuanji('vl_adward_yt')
				},
    ai: {
        order: 14,
        result: {
            target(player, target, storage) {
							if (player.storage.vl_adward_yt) {
								const ones = game.filterPlayer(function (current) {
									return current.isMinHp()
								})
								const num = Math.min(3, Math.abs(ones[0].hp - target.hp))
								return -2 * num
							} else {
								const ones = game.filterPlayer(function (current) {
									return current.isMaxHp()
								})
								const num = Math.min(3, Math.abs(target.hp - ones[0].hp))
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
