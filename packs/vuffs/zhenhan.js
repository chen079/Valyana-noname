import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "震撼",
        content: "<li>你使用牌不能指定对你施加「震撼」的角色为目标。<li>每回合结束时，清除所有「震撼」层数。",
    },
    trigger: {
        global: 'phaseEnd'
    },
    charlotte: true,
    forced: true,
    silent: true,
    priority: 3,
    async content(event, trigger, player) {
        await player.clearVuff('zhenhan')
    },
    mod: {
        playerEnabled: function (card, player, target) {
            if (player.getStorage('zhenhan_Source', []).includes(target)) return false;
        },
    },
    vuffInfo: {
        naturalLose: false,
        type: 'devuff',
        vuffRank: {
            basic: [0, 2],
        }
    },
};
