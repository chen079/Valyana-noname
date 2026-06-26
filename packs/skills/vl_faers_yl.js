import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "discardAfter",
    },
    forced: true,
    filter(event, player) {
        if (!event.cards) return false;
        for (let i = 0; i < event.cards.length; i++) {
            if (get.name(event.cards[i]) == 'tao') return true;
        }
        return false;
    },
    async content(event, trigger, player) {
        player.recover()
    },
    t: {
        name: "命论",
        info: "锁定技，当你弃置你的【桃】后，你回复1点体力。",
    },
};
