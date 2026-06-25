import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    usable: 1,
    firstDo: true,
    forced: true,
    filter: function (event, player) {
					var history = event.player.getHistory('damage', null, event), num = 0;
					for (var i of history) num += i.num;
					return num > 1 && (num - event.num) < 2;
				},
    content: function () {
					player.recover();
					player.draw()
				},
    t: {
        name: "冥聆",
        info: "锁定技，当你于同一回合内受到伤害达到2点后，你回复1点体力并摸一张牌。",
    },
};
