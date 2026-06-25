import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    direct: true,
    async content(event, trigger, player) {
let result = await player.chooseTarget('回雪：是否发动此技能？', function (event, player, target) {
        						return target != player
        					}).set("ai", function (target) {
        						var player = _status.event.player
        						var att = get.attitude(player, target)
        						if (player.countCards('j') > 0 && target.hp == target.maxHp) {
        							return att + target.hp
        						} else if (target.hp == 1 && att > 0) {
        							return att / target.hp
        						} else if (target.countCards('j') > 0 && att > 0) {
        							return att
        						} else if (target.hp == 1 && player.hp > 2) {
        							return -att
        						} else {
        							return -1
        						}
        					}).forResult()
if (result.bool) {
        						event.target = result.targets[0]
        						var next = player.chooseControl("选项一", "选项二").set("prompt", "请选择发动的选项：").set('choiceList', ['你弃置其与你区域内的各一张牌，然后各自回复1点体力', '你与其各失去1点体力，然后各摸一张牌。'])
        						next.ai = function () {
        							var player = _status.event.player
        							if (player.countCards('j') > 0) return 0
        							if (player.hp == player.maxHp) return 1
        							return 0
        						}
        						result = await next.forResult()
        					} else {
        						return
        					}
if (result.index == 0) {
        						await player.discardPlayerCard(player, 'hej', true)
        						await player.discardPlayerCard(event.target, 'hej', true)
        						await player.recover()
        						await event.target.recover()
        					} else {
        						await player.loseHp()
        						await event.target.loseHp()
        						await player.draw()
        						await event.target.draw()
        					}
    },
    t: {
        name: "回雪",
        info: "准备阶段，你可以选择一名其他角色并选择一项：1.你弃置其与你区域内的各一张牌，然后各回复1点体力；2.你与其各失去1点体力，然后各摸一张牌。",
    },
};
