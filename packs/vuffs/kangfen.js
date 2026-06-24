import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "亢奋",
        content: "<li>你使用【杀】无次数限制。<li>当你使用【杀】结算完毕后，你弃置受伤角色的X张牌，然后你移除一层「<font color=fire>亢奋</font>」<li>你的攻击范围+X，你的手牌上限-X。",
    },
    charlotte: true,
    trigger: {
        player: "useCardAfter",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('kangfen') && event.card.name == 'sha'
    },
    async content(event, trigger, player) {
        const num = player.countVuffNum("kangfen");
        const damaged = player.getHistory('sourceDamage', function (evt) {
            return evt.card == trigger.card
        }).map(i => i.player)
        for (const i of damaged) {
            if (i.countDiscardableCards(player, 'he') > 0) await player.discardPlayerCard(i, num, 'he', true);
        }
        await player.reduceVuff('kangfen')
    },
    mod: {
        cardUsable: function (card, player, num) {
            if (card.name == 'sha' && player.hasVuff('kangfen')) return Infinity;
        },
        attackRange: function (player, range) {
            if (player.countVuffNum("kangfen") > 0) {
                const num = player.countVuffNum("kangfen");
                return range + num;
            }
        },
        maxHandcard: function (player, num) {
            if (player.countVuffNum("kangfen") > 0) {
                const numx = player.countVuffNum("kangfen");
                return num - numx;
            }
        },
    },
    vuffInfo: {
        naturalLose: true,
        type: 'none',
        vuffRank: {
            basic: [1, 0],
            add: [1.15, 0.4],
        },
    }
};
