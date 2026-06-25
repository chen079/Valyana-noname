import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        targetEnabled: function (card, player, target, now) {
						if (card.name == 'bingliang') return false;
					},
    },
    trigger: {
        player: "phaseJieshuBegin",
    },
    forced: true,
    filter: (event, player) => game.hasPlayer(function (current) {
					return current.countCards('h') > current.hp
				}),
    content: () => {
					var num = game.countPlayer(function (current) {
						return current.countCards('h') > current.hp
					})
					player.draw(num)
				},
    t: {
        name: "祀兴",
        info: "锁定技，你无法成为【兵粮寸断】的目标。结束阶段，每有一名角色手牌数大于其体力值，你摸一张牌。",
    },
};
