import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "免疫",
        content: "<li>当你受到伤害时，移除一层「<font color=gray>免疫</font>」并取消之。",
    },
    charlotte: true,
    trigger: {
        player: 'damageBegin2'
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('mianyi')
    },
    async content(event, trigger, player) {
        await player.reduceVuff('mianyi')
        trigger.cancel();
    },
    ai: {
        nofire: true,
        nothunder: true,
        nodamage: true,
        effect: {
            target: function (card, player, target, current) {
                if (get.tag(card, 'damage')) return [0, 0];
            }
        },
    },
    vuffInfo: {
        naturalLose: true,
        limit: 2,
        type: 'vuff',
        vuffRank: {
            basic: [2, 0],
        },
        vuffReject: ['yishang'],
    },
};
