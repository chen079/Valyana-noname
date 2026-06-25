import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
    },
    direct: true,
    mod: {
        targetInRange: function (card, player, target) {
						if (target.yuehua) return true;
					},
        cardUsableTarget: function (card, player, target) {
						if (target.yuehua) return true;
					},
    },
    content: function () {
					'step 0'
					game.filterPlayer(function (current) {
						if (current != player) {
							current.style.border = '2px solid #ccc'
							current.style.boxShadow = '0 0 30px 5px rgba(255, 255, 255, 0.7)'
							current.yuehua = true
						}
					})
				},
    group: ["vl_sainit_yj_damage"],
    subSkill: {
        damage: {
            trigger: {
                source: "damageBegin2",
            },
            direct: true,
            filter: function (event, player) {
							return event.player != player && event.player.yuehua
						},
            content: function () {
							'step 0'
							trigger.num++
							'step 1'
							player.chooseTarget('弃置一名其他角色一张牌', function (card, player, target) {
								return target != player && target.countCards('he') > 0
							}).set('ai', function (target) {
								var player = _status.event.player
								return -get.attitude(player, target)
							})
							'step 2'
							if (result.bool) {
								var target = result.targets[0]
								player.discardPlayerCard('he', target, true)
							}
							'step 3'
							trigger.player.yuehua = false
							trigger.player.style.border = ''
							trigger.player.style.boxShadow = ''
						},
        },
    },
    t: {
        name: "月皎",
        info: "每轮开始时，你令所有其他角色获得“月华”标记，你对有“月华”的角色造成伤害时，此伤害+1并可以弃置一名其他角色一张牌，然后移除受伤角色的“月华”。你对有“月华”的角色使用牌无距离和次数限制。",
    },
};
