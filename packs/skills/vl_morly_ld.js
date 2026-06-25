import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard1",
    },
    init: function (player) {
					if (!player.storage.vl_morly_ld_num) player.storage.vl_morly_ld_num = 0;
				},
    direct: true,
    filter: function (event, player) {
					if (event.card.name == 'sha' && !event.card.nature) return true;
				},
    mark: true,
    intro: {
        content: function (storage, player, skill) {
						if (player.storage.vl_morly_ld_num == 0) return '你使用的下一张普通【杀】改为火属性'
						else if (player.storage.vl_morly_ld_num == 1) return '你使用的下一张普通【杀】改为雷属性'
						else if (player.storage.vl_morly_ld_num == 2) return '你使用的下一张普通【杀】改为冰属性'
						else if (player.storage.vl_morly_ld_num == 3) return '你使用的下一张普通【杀】改为神属性'
					},
    },
    content: function () {
					var shanature = ['fire', 'thunder', 'ice', 'kami']
					if (!player.storage.vl_morly_ld_num) { player.storage.vl_morly_ld_num = 0 }
					var num = player.storage.vl_morly_ld_num
					trigger.card.nature = shanature[num]
					player.storage.vl_morly_ld_num++
					if (player.storage.vl_morly_ld_num == 4) {
						player.storage.vl_morly_ld_num = 0
					}
				},
    ai: {
        threaten: 3,
    },
    subSkill: {
        num: {
            sub: true,
        },
    },
    t: {
        name: "连弹",
        info: "当你使用普通【杀】时，此【杀】属性改为按照以下顺序循环：“火属性”、“雷属性”、“冰属性”、“神属性”。",
    },
};
