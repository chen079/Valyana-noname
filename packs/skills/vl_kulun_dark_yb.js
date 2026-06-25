import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    linkage: "ice",
    direct: true,
    trigger: {
        source: "damageSource",
    },
    filter: function (event, player) {
					return event.card.name == 'sha' & ((player.name1 == 'vl_kulun_ice') || (player.name2 == 'vl_kulun_ice'));
				},
    content: function () {
					trigger.player.addVuff('dongshang')
				},
    t: {
        name: "影冰",
        info: "连携-寒冰：你的【杀】造成伤害后，受到伤害的角色获得1层「冻伤」。",
    },
};
