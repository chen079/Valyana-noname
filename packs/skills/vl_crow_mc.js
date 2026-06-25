import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        global: "useCard",
    },
    filter(event, player) {
					return get.zhinangs().includes(event.card.name) || player.getStorage('vl_crow_my').includes(event.card.name)
				},
    async content(event, trigger, player) {
					player.draw();
				},
    ai: {
        threaten: 1.4,
        noautowuxie: true,
    },
    t: {
        name: "谋策",
        info: `锁定技，当一名角色使用${get.poptip("rule_zhinang")}牌名的锦囊或${get.poptip("vl_crow_my")}①记录的牌时，你摸一张牌。`,
    },
};
