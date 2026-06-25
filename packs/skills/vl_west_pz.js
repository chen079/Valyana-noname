import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["recoverEnd"],
    },
    direct: true,
    filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.isDamaged();
					})
				},
    content: function () {
					'step 0'
					var num = game.countPlayer(function (current) {
						return current.isDamaged() && current != player
					})
					player.chooseTarget([1, Math.min(num, trigger.num)], get.prompt('vl_west_pz'), '令至多' + Math.min(num, trigger.num) + '名已受伤的其他角色回复1点体力', function (card, player, target) {
						return player != target && target.isDamaged()
					}).set('ai', function (target) {
						var player = _status.event.player;
						return get.recoverEffect(target, player, player);
					});
					'step 1'
					if (result.bool) {
						player.logSkill('vl_west_pz', result.targets);
						result.targets.sortBySeat()
						for (var i = 0; i < result.targets.length; i++) {
							result.targets[i].recover();
						}
					}
				},
    t: {
        name: "普照",
        info: "当你回复体力后，你可以令至多X名已受伤的其他角色回复1点体力（X为你回复的体力值）。",
    },
};
