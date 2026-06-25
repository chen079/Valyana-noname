import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "dying",
    },
    direct: true,
    forceDie: true,
    mark: true,
    intro: {
        content: "已发动技能$次",
    },
    init: function (player) {
					if (!player.storage.vl_siji_ys) player.storage.vl_siji_ys = 0
				},
    filter: (event, player) => {
					return player.countCards('h') > 0 && game.hasPlayer(current => current.countDiscardableCards('h', player) > 0 && current != player)
				},
    content: function () {
					'step 0'
					player.chooseToDiscard('h', get.prompt2('vl_siji_ys'))
						.set('ai', function (card) {
							if (get.attitude(player, trigger.player) > 0) {
								return 12 - get.value(card)
							} else {
								return -1
							}
						})
					'step 1'
					if (result.bool) {
						event.card1 = result.cards[0]
						player.chooseTarget(get.prompt('vl_siji_ys'), '弃置一名其他角色的一张牌', function (card, player, target) {
							return target != player && target.countDiscardableCards('h', player) > 0
						})
					} else {
						event.finish()
					}
					'step 2'
					if (result.bool) {
						player.discardPlayerCard('h', result.targets[0], true)
					}
					'step 3'
					if (result.bool && result.cards && result.cards.length) {
						event.card2 = result.cards[0]
						player.storage.vl_siji_ys++
						if (get.color(event.card1) === get.color(event.card2)) {
							trigger.player.recover()
						}
					} else {
						event.finish()
					}
					'step 4'
					if (player.storage.vl_siji_ys >= 3) {
						player.chooseTarget(get.prompt('vl_siji_ys'), '选择一名其他角色，你与其摸牌阶段摸牌+1且手牌上限+1。', function (card, player, target) {
							return target != player
						})
					} else {
						event.finish()
					}
					'step 5'
					if (result.bool) {
						var target = result.targets[0]
						target.addSkill('vl_siji_ys_draw')
						player.addSkill('vl_siji_ys_draw')
						player.removeSkill('vl_siji_ys')
					}
				},
    subSkill: {
        draw: {
            trigger: {
                player: "phaseDrawBegin2",
            },
            mark: true,
            intro: {
                content: "手牌上限+1，摸牌阶段多摸一张牌。",
            },
            forced: true,
            preHidden: true,
            filter: function (event, player) {
							return !event.numFixed;
						},
            content: function () {
							trigger.num++;
						},
            ai: {
                threaten: 1.5,
            },
            mod: {
                maxHandcard: function (player, num) {
								return num + 1
							},
            },
            _priority: 0,
        },
    },
    t: {
        name: "佑生",
        info: "当一名角色进入濒死状态后，你可以依次弃置自己与一名其他角色各一张手牌，若颜色相同，则该濒死角色回复1点体力。此技能发动三次后，你可以选择一名其他角色，你与其摸牌阶段摸牌+1且手牌上限+1，然后你失去「vl_siji_ys」。",
    },
};
