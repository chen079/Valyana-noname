import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    shaRelated: true,
    trigger: {
        source: "damageSource",
        player: "damageEnd",
    },
    forced: true,
    filter: (event, player) => {
					var target = event.player == player ? event.source : player
					if (!target) return false
					return player.countCards('h') != target.hp
				},
    content: function () {
					"step 0"
					var target = trigger.player == player ? trigger.source : player
					if (target) {
						var num = target.hp - player.countCards('h')
						if (num > 0) {
							player.draw(Math.min(5, num))
						} else {
							player.chooseToDiscard('h', Math.min(5, -num), true)
						}
					}
				},
    ai: {
        maixie_defend: true,
        effect: {
            target: function (card, player, target) {
							if (player.countCards('he') > 1 && get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
								if (get.attitude(target, player) < 0 && target.hp > player.countCards('h')) return [1, 1];
							}
						},
        },
    },
    _priority: 0,
    t: {
        name: "浅吟",
        info: "锁定技，当你造成/受到伤害后，你将手牌数调整为你/伤害来源的体力值（至多调整五张牌）。",
    },
};
