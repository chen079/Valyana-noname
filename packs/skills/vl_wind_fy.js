import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["phaseJieshuBegin", "phaseZhunbeiBegin"],
    },
    mark: true,
    intro: {
        markcount: () => undefined,
        mark(dialog, storage, player) {
						dialog.addText('当前技能效果为：')
						dialog.addText((player.storage.vl_wind_fy['时'] ? '准备阶段' : '一名角色的结束阶段') + '你可以令' + (player.storage.vl_wind_fy['象'] ? '自己' : '一名其他角色') + (player.storage.vl_wind_fy['效'] ? '摸' : '弃置') + '一张牌')
					},
    },
    direct: true,
    init(player) {
					if (!player.storage.vl_wind_fy) player.storage.vl_wind_fy = {
						'时': true,
						'象': true,
						'效': true,
					}
				},
    filter(event, player) {
					const trigger = player.storage.vl_wind_fy['时'] ? 'phaseZhunbei' : 'phaseJieshu'
					if (event.name != trigger) return false
					return true
				},
    async content(event, trigger, player) {
const result = await player.chooseTarget('【风吟】：是否选择令' + (player.storage.vl_wind_fy['象'] ? "自己" : "一名其他角色") + (player.storage.vl_wind_fy['效'] ? "摸" : "弃置") + "一张牌")
        						.set('filterTarget', function (card, player, target) {
        							if (player.storage.vl_wind_fy['象']) {
        								return target == player
        							} else {
        								if (!player.storage.vl_wind_fy['效']) {
        									return target != player && target.countCards('he') > 0
        								}
        								return target != player
        							}
        						}).set('ai', function (target) {
        							const player = _status.event.player
        							const att = get.attitude(player, target)
        							if (player.storage.vl_wind_fy['效']) {
        								return att
        							} else {
        								return -att
        							}
        						}).forResult()
if (result.bool) {
        						const target = result.targets[0]
        						let next;
        						if (player.storage.vl_wind_fy['效']) {
        							next = target.draw(1)
        						} else {
        							next = target.chooseToDiscard(1, 'he', true)
        						}
        						event.trigger('vl_wind_fy_change')
        						await next;
        					} else {
        						return
        					}
    },
    group: "vl_wind_fy_change",
    subSkill: {
        change: {
            trigger: {
                player: "vl_wind_fy_change",
            },
            direct: true,
            async content(event, trigger, player) {
const list = ['时', '象', '效']
        							if (list.includes(player.storage.vl_wind_fy_change)) list.remove(player.storage.vl_wind_fy_change)
        							const result = await player.chooseControl(list).set('prompt', get.prompt2('vl_wind_fy')).set('ai', function () {
        								const player = _status.event.player
        								if (player.storage.vl_wind_fy['象'] && player.storage.vl_wind_fy['效']) {
        									if (list.includes('时')) {
        										return '时'
        									} else {
        										return list.randomGet()
        									}
        								} else if (player.storage.vl_wind_fy['象'] && !player.storage.vl_wind_fy['效']) {
        									if (list.includes('效')) {
        										return '效'
        									} else {
        										return list.randomGet()
        									}
        								} else if (!player.storage.vl_wind_fy['象'] && !game.hasPlayer(function (current) {
        									return get.attitude(player, current) > 0 && player.storage.vl_wind_fy['效']
        								})) {
        									return list.randomGet()
        								} else {
        									if (list.includes('象')) {
        										return '象'
        									} else {
        										return list.randomGet()
        									}
        								}
        							}).forResult()
player.storage.vl_wind_fy_change = result.control
        							player.storage.vl_wind_fy[result.control] = !player.storage.vl_wind_fy[result.control]
    },
        },
    },
    t: {
        name: "风吟",
        info: "游戏开始时，你获得<br>“时”：<li>正：一名角色的准备阶段；<li>反：一名角色的结束阶段，</li>“象”：<li>正：自己；<li>反：一名其他角色，</li>“效”：<li>正：摸一张牌；<li>反：弃置一张牌，</li>三枚标记，并均视为正面。然后此技能的效果为时-象-效的组合，当此技能结算完毕后，你将一枚上次没有选择过的标记反转。",
    },
};
