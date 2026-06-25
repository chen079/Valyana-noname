import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    charlotte: true,
    marktext: "异",
    intro: {
        name: "异变",
        content: "本局游戏内计算【乐不思蜀】与【兵粮寸断】的效果反转",
    },
    mod: {
        judge: function (player, result) {
						if ((_status.event.cardname == 'lebu' || _status.event.cardname == 'bingliang')) {
							if (result.bool == false) {
								result.bool = true;
							}
							else {
								result.bool = false;
							}
						}
					},
    },
    t: {
        name: "异变",
        info: "本局游戏计算【乐不思蜀】与【兵粮寸断】的效果反转。",
    },
};
