import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "燃烧",
        content: "<li>当你受到冰属性伤害时，你移除X层「<font color=fire>燃烧</font>」。<li>自然衰减时，你受到1点无来源火属性伤害。",
    },
    charlotte: true,
    trigger: {
        player: ["damage", "reduceVuffBegin2"],
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (!player.hasVuff("ranshao")) return false;
        if (onrewrite == 'damage') return event.nature && event.nature == 'ice';
        else return event.buff == 'ranshao' && event.naturalLose
    },
    async content(event, trigger, player) {
        const onrewrite = event.triggername;
        if (onrewrite == 'damage') {
            player.olearVuff('ranshao', num)
        } else {
            await player.damage('fire', 'nosource');
        }
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 2],
            add: [0, 0.2],
        },
        vuffReject: ['dongshang']
    }
};
