import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "灵秘",
        content: "<li>出牌阶段，你可以消耗1层「灵秘」，重铸一张牌",
    },
    enable: "phaseUse",
    // trigger: {
    //     player: 'recastAfter'
    // },
    charlotte: true,
    // forced: true,
    silent: true,
    priority: 3,
    position: "he",
    selectCard: 1,
    discard: false,
    lose: false,
    delay: false,
    prompt: "消耗1层「灵秘」，选择一张牌重铸",
    filterCard(card, player, event) {
        if (!event) event = _status.event;
        return game.checkMod(card, player, "unchanged", "cardEnabled2", player);
    },
    // filter(event, player) {
    //     if(event.type != "phase")return;
    //     return event.cards.some(card => {
    //         const info = get.info(card), recastable = info.recastable || info.chongzhu
    //         return !Boolean(typeof recastable == 'function' ? recastable(_status.event, player) : recastable);
    //     })
    // },
    async content(event, trigger, player) {
        await player.reduceVuff('lingmi', 1);
        await player.recast(event.cards);

    },
    // mod: {
    //     cardRecastable: function (card, player) {
    //         if (player.hasVuff('lingmi')) return true
    //     }
    // },
    vuffInfo: {
        naturalLose: false,
        vuffRank: {
            basic: [0.5, 0]
        },
        type: 'vuff',
    },
};
