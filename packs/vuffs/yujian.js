import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "预见",
        content: "<li>你的回合外，当前回合角色手牌对你可见。<li>你的回合内，你可以在前三次摸牌前卜算X+1。",
    },
    charlotte: true,
    trigger: {
        player: "drawBefore",
    },
    usable: 3,
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("yujian") && _status.currentPhase == player
    },
    async content(event, trigger, player) {
        const num = player.countVuffNum("yujian")
        await player.chooseToGuanxing(num + 1);
    },
    vuffInfo: {
        naturalLose: true,
        type: 'vuff',
        vuffRank: {
            basic: [0.6, 0],
        }
    },
    ai: {
        viewHandcard: true,
        skillTagFilter(player, tag, arg) {
            if (!player.hasVuff('yujian')) return false;
            if (player == arg || _status.currentPhase != arg) return false;
        },
    }
};
