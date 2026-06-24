import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "敏捷",
        content: "<li>当你成为其他角色伤害类牌的目标时，移除一层「<font color=blue>敏捷</font>」并进行一次判定，若结果为黑色，此牌对你无效。",
    },
    charlotte: true,
    trigger: {
        target: "useCardToPlayered",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("mingjie") && get.tag(event.card, 'damage') && event.player != player
    },
    async content(event, trigger, player) {
        await player.reduceVuff('mingjie')
        game.log(player, '受「<font color=gray>敏捷</font>」影响');
        const next = player.judge('vuff_mingjie', function (card) { return (get.color(card) == 'black') ? 1.5 : -0.5 });
        next.judge2 = function (result) {
            return result.bool;
        };
        const result = await next.forResult();
        if (result.judge > 0) {
            trigger.excluded.push(player);
        }
    },
    vuffInfo: {
        naturalLose: true,
        type: 'vuff',
        limit: 3,
        vuffRank: {
            basic: [1.5, 0],
            random: [0.5, 0]
        },
        vuffReject: ['mabi', 'chihuan'],
    }
};
