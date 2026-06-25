import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    derivation: "vl_zhufu",
    trigger: {
        global: "roundStart",
        player: "enterGame",
    },
    filter: function (event, player) {
					return game.players.length > 1;
				},
    direct: true,
    content: function () {
					"step 0"
					player.chooseTarget([1, Math.floor(game.countPlayer() / 2)], "令至多" + get.translation(Math.floor(game.countPlayer() / 2)) + "名角色获得〖祝福〗", false)
						.set('ai', function (target) {
							return get.attitude(_status.event.player, target) * (1 + target.countCards('j'))
						})
					"step 1"
					if (result.bool) {
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].addTempSkill('vl_zhufu', { player: "phaseAfter" })
							result.targets[i].addVuff('qiyuan', 1)
						}
					}
				},
    ai: {
        threaten: 2.5,
    },
    t: {
        name: "祥瑞",
        info: "一轮游戏开始时，你可以选择至多X名角色，你可以令这些角色获得1层「祈愿」，并获得〖祝福〗直到其回合结束（X为场上角色数的一半并向下取整）。",
    },
};
