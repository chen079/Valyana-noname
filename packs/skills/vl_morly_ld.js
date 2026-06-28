import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard1",
    },
    init(player) {
        if (!player.hasStorage('vl_morly_ld_num')) player.setStorage('vl_morly_ld_num', 0);
    },
    direct: true,
    filter(event, player) {
        if (event.card.name == 'sha' && !event.card.nature) return true;
    },
    mark: true,
    intro: {
		content(storage, player, skill) {
            if (player.getStorage('vl_morly_ld_num', 0) == 0) return '你使用的下一张普通【杀】改为火属性'
            else if (player.getStorage('vl_morly_ld_num', 0) == 1) return '你使用的下一张普通【杀】改为雷属性'
            else if (player.getStorage('vl_morly_ld_num', 0) == 2) return '你使用的下一张普通【杀】改为冰属性'
            else if (player.getStorage('vl_morly_ld_num', 0) == 3) return '你使用的下一张普通【杀】改为神属性'
        },
    },
    async content(event, trigger, player) {
        let shanature = ['fire', 'thunder', 'ice', 'kami']
        if (!player.hasStorage('vl_morly_ld_num')) { player.setStorage('vl_morly_ld_num', 0) }
        let num = player.getStorage('vl_morly_ld_num', 0)
        trigger.card.nature = shanature[num]
        player.setStorage('vl_morly_ld_num', player.getStorage('vl_morly_ld_num', 0) + 1)
        if (player.getStorage('vl_morly_ld_num', 0) == 4) {
            player.setStorage('vl_morly_ld_num', 0)
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
