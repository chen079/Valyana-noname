import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    forced: true,
    filter: (event, player) => {
					var history = player.getHistory('damage');
					if (history.indexOf(event) != 0) return false;
					return true
				},
    content: function () {
					player.addTempVuff('bihu')
					player.addTempVuff('huisheng')
				},
    t: {
        name: "灵影",
        info: "当你于一回合内首次受到伤害后，你获得1层「回生」和「庇护」直到回合结束。",
    },
};
