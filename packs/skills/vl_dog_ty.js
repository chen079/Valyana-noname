import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    onremove: true,
    mark: true,
    intro: {
        mark: function (dialog, content, player) {
						if (player != game.me) return get.translation(player) + '观看牌堆中...';
						if (get.itemtype(_status.pileTop) != 'card') return '牌堆顶无牌';
						dialog.add([_status.pileTop]);
					},
    },
    t: {
        name: "天眼",
        info: "锁定技，牌堆顶一张牌对你可见。",
    },
};
