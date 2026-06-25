import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    linkage: "fire",
    ai: {
        viewHandcard: true,
        skillTagFilter(player, tag, arg) {
            if (!(player.name1 == 'vl_kulun_fire' || player.name2 == 'vl_kulun_fire')) return false;
        },
    },
    t: {
        name: "通明",
        info: "连携-火焰：其他角色的手牌对你可见。",
    },
};
