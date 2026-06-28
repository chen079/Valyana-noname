import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        content: "cards",
        onunmark(storage, player) {
            if (storage && storage.length) {
                player.$throw(storage, 1000);
                game.cardsDiscard(storage);
                game.log(storage, '被置入了弃牌堆');
                storage.length = 0;
            }
        },
    },
    enable: "phaseUse",
    usable: 1,
    init(player, skill) {
        if (!player.hasStorage(skill)) player.setStorage(skill, []);
    },
    filter(event, player) {
        return player.getStorage('vl_rest_qf', []).length < 4 && player.countCards('h') > 0;
    },
    visible: true,
    filterCard: true,
    selectCard() {
        let player = _status.event.player;
        return [1, 4 - player.getStorage('vl_rest_qf', []).length];
    },
    discard: false,
    toStorage: true,
    delay: false,
    async content(event, trigger, player) {
        const cards = event.cards;
        player.$give(cards, player, false);
        player.markAuto('vl_rest_qf', cards);
    },
    check(card) {
        return 8 - get.value(card);
    },
    onremove(player, skill) {
        let cards = player.getStorage('vl_rest_qf', []);
        if (cards.length) player.loseToDiscardpile(cards);
    },
    ai: {
        order: 5,
        result: {
            player: 1,
        },
    },
    group: "vl_rest_qf_1",
    subSkill: {
        "1": {
            trigger: {
                source: "damageSource",
            },
            frequent: true,
            check(event, player) {
                return get.attitude(player, event.player) < 0
            },
            async content(event, trigger, player) {
                const result = await player.judge().forResult();
                if (result.color == 'red') {
                    await player.draw();
                }
                if (result.color == 'black') {
                    await player.discardPlayerCard(1, trigger.player, 'h', true);
                }
            },
            sub: true,
        },
    },
    t: {
        name: "阙福",
        info: "出牌阶段限一次，你可以将至多四张手牌置于你的武将上，称为“孽”（你最多拥有四枚“孽”）。当你造成伤害后，可以进行一次判定，若结果为红色，你摸一张牌； 若结果为黑色，你弃置受到伤害的角色一张手牌。",
    },
};
