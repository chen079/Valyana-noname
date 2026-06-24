import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "迟缓",
        content: "<li>当你成为其他角色伤害类牌的唯一目标时，移除一层「<font color=gray>迟缓</font>」并进行一次判定，若结果为黑色，此牌结算两次。",
    },
    charlotte: true,
    trigger: {
        target: "useCardToPlayered",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("chihuan") && get.tag(event.card, 'damage') && event.player != player && event.targets.length == 1
    },
    async content(event, trigger, player) {
        await player.reduceVuff('chihuan')
        game.log(player, '受「<font color=gray>迟缓</font>」影响');
        const next = player.judge('vuff_chihuan', function (card) { return (get.color(card) == 'black') ? -2 : 0 });
        next.judge2 = function (result) {
            if (result.bool == false) return true;
            return false;
        };
        const result = await next.forResult();
        if (result.judge < 0) {
            trigger.getParent('useCard').effectCount++;
        }
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        limit: 3,
        vuffRank: {
            basic: [0, 1.5],
            random: [0, 0.5]
        },
        vuffReject: ['mingjie'],
    }
};
