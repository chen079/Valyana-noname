import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "consumeVpBegin2",
    },
    frequent: true,
    filter(event, player) {
        return player.isMinHandcard()
    },
    async content(event, trigger, player) {
        await player.draw()
    },
    t: {
        name: "得失",
        info: `当你消耗${get.poptip("moli")}时，若你的手牌数为全场最少，你可以摸一张牌。`,
    },
};
