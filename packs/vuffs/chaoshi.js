import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "潮湿",
        content: "<li>当你受到雷属性伤害时，此伤害+1；<li>当你受到火属性伤害时，此伤害-1；<li>然后你移除1层「<font color=blue>潮湿</font>」。",
    },
    forced: true,
    silent: true,
    charlotte: true,
    priority: 3,
    filter(event, player) {
        return event.hasNature('fire') || event.hasNature('thunder')
    },
    trigger: {
        player: "damageBegin3",
    },
    async content(event, trigger, player) {
        if (trigger.hasNature('fire')) {
            trigger.num--
            game.log(player, '受到「<font color=blue>潮湿</font>」影响，此次火属性伤害-1')
        }
        if (trigger.hasNature('thunder')) {
            trigger.num++
            game.log(player, '受到「<font color=blue>潮湿</font>」影响，此次雷属性伤害+1')
        }
        await player.reduceVuff('chaoshi')
    },
    ai: {
        nofire: true,
        effect: {
            target: function (card, player, target, current) {
                if (get.tag(card, 'fireDamage')) return 'zerotarget';
            },
        },
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [0, 1],
            add: [0, 1.5]
        },
        type: 'none',
    },
};
