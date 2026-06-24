import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "荆棘",
        content: "<li>当你于一回合内使用第4-X张牌结算完毕后，你失去1点体力并移除1层「<font color=green>荆棘</font>」。",
    },
    forced: true,
    silent: true,
    charlotte: true,
    priority: 3,
    trigger: {
        player: "useCardAfter",
    },
    filter(event, player) {
        return player.hasVuff('jingji') && player.countUsed() == 4 - player.countVuffNum('jingji')
    },
    async content(event, trigger, player) {
        await player.loseHp()
        await player.reduceVuff('jingji')
    },
    ai: {
        presha: true,
        pretao: true,
        nokeep: true,
        skillTagFilter(player, tag, arg) {
            if (tag == "nokeep") {
                return player.isPhaseUsing();
            }
        }
    },
    mod: {
        aiOrder: function (player, card, num) {
            if (typeof card == 'object' && (4 - player.countVuffNum('jingji') < player.countUsed())) return num - 5 + 2 * player.countCards('h', 'tao') + player.countCards('h', 'jiu');
        },
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [0, 1],
            add: [0, 1.5]
        },
        type: 'devuff',
        limit: 3,
    },
};
