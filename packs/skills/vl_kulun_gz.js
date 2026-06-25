import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
        return player.getStorage('vl_kulun_zn').length > 0
    },
    async content(event, trigger, player) {
        const next = game.createEvent('vl_kulun_zn_clique');
        next.player = player;
        next.num = 4;
        next.setContent(lib.skill.vl_kulun_zn.contentx);
        await next;
    },
    ai: {
        order: 14,
        result: {
            player: 2,
        },
    },
    t: {
        name: "过载",
        info: "出牌阶段限一次，你可以随机观看四张“元素”牌（不足则全部观看），选择一张注入。",
    },
};
