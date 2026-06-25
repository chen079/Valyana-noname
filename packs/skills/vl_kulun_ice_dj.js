import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    forced: true,
    linkage: "water",
    filter: function (event, player) {
					return ((player.name1 == 'vl_kulun_water') || (player.name2 == 'vl_kulun_water'));
				},
    content: function () {
					trigger.directHit.addArray(game.filterPlayer(current => {
						return current.getHistory('lose').length > 0
					}));
				},
    ai: {
        directHit_ai: true,
        skillTagFilter: function (player, tag, arg) {
						return player.getHistory('lose').length > 0 && player.group == arg.target.group;
					},
    },
    t: {
        name: "冻结",
        info: "连携-潮汐：锁定技，你的回合内，本回合失去过牌的其他角色不能响应你使用的牌",
    },
};
