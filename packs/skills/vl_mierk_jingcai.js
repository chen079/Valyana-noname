import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "chooseCard",
    filter(event, player) {
        return event.type == 'compare' && !event.directresult;
    },
    onCompare(player) {
        return game.cardsGotoOrdering(get.cards()).cards;
    },
    group: "vl_mierk_jingcai_number",
    subSkill: {
        number: {
            trigger: {
                player: "compare",
                target: "compare",
            },
            filter(event, player) {
                if (event.iwhile) return false
                return get.color(event.card1) == get.color(event.card2)
            },
            silent: true,
            async content(event, trigger, player) {
                game.log(player, '拼点牌点数视为', '#yK');
                if (player == trigger.player) {
                    trigger.num1 = 13;
                }
                else {
                    trigger.num2 = 13;
                }
            },
            sub: true,
            forced: true,
            popup: false,
            _priority: 1,
        },
    },
    _priority: 0,
    t: {
        name: "惊才",
        info: "你拼点时，可以改为用牌堆顶的一张牌进行拼点；当你拼点的牌亮出后，若此牌颜色与对方相同，则此牌的点数视为K。",
    },
};
