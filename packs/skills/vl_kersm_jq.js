import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "loseAfter",
    },
    filter(event, player) {
        return event.player != player && event.type == 'discard' && (!player.storage.vl_kersm_my || event.player != player.storage.vl_kersm_my[0])
    },
    direct: true,
    async content(event, trigger, player) {
        let cards = [];
        for (let i = 0; i < trigger.cards.length; i++) {
            if (get.position(trigger.cards[i], true) == 'd') {
                cards.push(trigger.cards[i]);
            };
        }
        if (cards) player.gain(cards, 'gain2', 'log');
    },
    t: {
        name: "攫取",
        info: "其他角色的牌因弃置而进入弃牌堆后，若其上次没有被〖盟约〗指定，你获得此牌。",
    },
};
