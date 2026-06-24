import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
            intro: {
                name: "凝滞",
                content: "<li>当你受到非「<font color=yellow>凝滞</font>」造成的伤害时，累计此伤害值并取消之。<li>当你消解「<font color=yellow>凝滞</font>」时，你受到记录值的伤害。",
            },
            forced: true,
            silent: true,
            charlotte: true,
            init: function (player) {
                if (!player.ningzhi) player.ningzhi = 0
            },
            trigger: {
                player: ['damageBegin3', 'reduceVuffBegin2']
            },
            filter(event, player, onrewrite) {
                if (onrewrite == 'damageBegin3') {
                    return player.hasVuff('ningzhi') && !event.ningzhi;
                } else {
                    return event.buff == 'ningzhi' && player.countVuffNum('ningzhi') <= event.num && event.num > 0
                }
            },
            async content(event, trigger, player) {
                if (event.triggername == 'damageBegin3') {
                    player.ningzhi += trigger.num
                    game.log(player, '受「<font color=yellow>凝滞</font>」影响，取消本次伤害，当前累计伤害值为' + player.ningzhi);
                    trigger.cancel()
                } else {
                    const next = player.damage(player.ningzhi);
                    next.ningzhi = true;
                    await next;
                    player.ningzhi = 0
                }
            },
            priority: 3,
            vuffInfo: {
                naturalLose: true,
                vuffRank: {
                    random: [1, 1]
                },
                type: 'none',
            },
        };
