import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    unique: true,
    frequent: true,
    firstDo: true,
    content: function () {
					"step 0"
					event.count = trigger.num
					"step 1"
					player.judge()
					"step 2"
					switch (result.color) {
						case 'red': player.recover(); break;
						case 'black': player.draw(2); break;
					}
					"step 3"
					event.count--
					if (event.count > 0) {
						event.goto(1)
					}
				},
    ai: {
        maixie: true,
        maixie_hp: true,
    },
    t: {
        name: "缓释",
        info: "当你受到1点伤害后，你可以进行一次判定，若结果为红色，你回复1点体力，若为黑色，你摸两张牌。",
    },
};
