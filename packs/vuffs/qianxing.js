import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "潜行",
        content: "<li>你不能成为其他角色的卡牌的目标。<li>当你对其他角色使用牌时，你清除「潜行」层数",
    },
    trigger: {
        player: "useCard",
    },
    charlotte: true,
    filter(event, player) {
        return player.hasVuff('qianxing') && event.target != player
    },
    forced: true,
    silent: true,
    priority: 3,
    async content(event, trigger, player) {
        await player.clearVuff('qianxing')
    },
    mod: {
        targetEnabled: function (card, player, target) {
            if (player != target) return false;
        },
    },
    vuffInfo: {
        naturalLose: true,
        limit: 1,
        type: 'vuff',
        vuffRank: {
            basic: [2, 0],
        },
    }
};
