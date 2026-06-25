import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseJieshuBegin",
    },
    init: function (player) {
					if (!player.storage.vl_guotang_yl) player.storage.vl_guotang_yl = []
				},
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						dialog.addText('成为过【永良】目标的角色：');
						dialog.addText(player.storage.vl_guotang_yl.map(i => get.translation(i)));
					},
    },
    direct: true,
    content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('vl_guotang_yl'), [1, player.hp]).set('ai', function (target) {
						var player = _status.event.player
						var att = get.attitude(player, target)
						if (att > 0) {
							if (target.hp == target.countCards('h') + 1) return att + 2
							return att
						} else {
							return -1
						}
					})
					'step 1'
					if (result.bool) {
						for (var i = 0; i < result.targets.length; i++) {
							var target = result.targets[i]
							if (!player.storage.vl_guotang_yl.includes(target)) player.storage.vl_guotang_yl.push(target)
						}
						event.targets = result.targets
					} else {
						event.finish()
					}
					'step 2'
					event.target = event.targets.shift()
					event.target.draw()
					'step 3'
					if (event.target.countCards('h') == event.target.hp) {
						event.target.recover()
						player.draw()
					}
					'step 3'
					if (event.targets.length) {
						event.goto(2)
					}
				},
    t: {
        name: "永良",
        info: "结束阶段，你可令至多X名角色各摸一张牌，若其因此手牌数与其体力值相同，则其回复1点体力，然后你摸一张牌。（X为你当前体力值）",
    },
};
