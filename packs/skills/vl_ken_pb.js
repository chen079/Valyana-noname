import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    mod: {
        targetEnabled(card, player, target) {
            if (get.type(card) == "delay") return false;
        },
    },
    t: {
        name: "屏蔽",
        info: "锁定技，你不能成为延时类锦囊牌的目标。",
    },
};
