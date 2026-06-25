import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    filter: (event, player) => event.player != player,
    forced: true,
    mod: {
        vuffIgnore(player, buff, type) {
						if (type == 'naturalLose' && buff == 'kangfen') return true
					},
    },
    async content(event, trigger, player) {
const next = player.judge(function (result) {
        						var num = get.number(result)
        						var hp = player.hp
        						if (num % hp == 0 || num % (hp + 2) == 0) {
        							return 1
        						} else {
        							return 0
        						}
        					});
        					next.judge2 = function (result) {
        						return result.bool ? true : false;
        					};
const result = await next.forResult();
var num = get.number(result.card)
        					var hp = player.hp
        					if (num % hp == 0) {
        						const next = player.gain(result.card)
        						player.addVuff('kangfen')
        						await next
        					}
        					if (num % (hp + 2) == 0) {
        						player.addVuff('kangfen', 2)
        						await player.insertPhase()
        					}
    },
    t: {
        name: "异兆",
        info: "锁定技。你的「亢奋」不会自然衰减。其他角色回合结束时，你进行判定，若点数为X的倍数，你获得判定牌和1层「亢奋」，若为X+2的倍数，你「亢奋」层数+2并执行一个额外回合（X为体力值）",
    },
};
