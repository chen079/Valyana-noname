import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToTargeted",
    },
    frequent: true,
    mark: true,
    onremove(player, skill) {
        let cards = player.getExpansions(skill);
        if (cards.length) player.loseToDiscardpile(cards);
    },
    intro: {
        content: "expansion",
        markcount: "expansion",
    },
    filter(event, player) {
        if (event.player == player) return false
        if (event.cards.length != 1) return false
        let list = []
        let cards = player.getExpansions('vl_knier_wh')
        if (cards.length == 0) return true
        for (let i = 0; i < cards.length; i++) {
            if (!list || !list.includes(get.suit(cards[i]))) {
                list.push(get.suit(cards[i]))
            }
        }
        if (!list.includes(get.suit(event.cards[0]))) return true
        return false
    },
    async content(event, trigger, player) {
        trigger.excluded.push(player)
        await player.addToExpansion(trigger.cards, 'gain2').gaintag.add('vl_knier_wh')
    },
    t: {
        name: "雾花",
        info: "当你成为其他角色使用牌的目标时，若此牌所对应的实体牌数为1且你的“雾花”中没有该花色的牌，你令此牌对你无效并置于武将牌上，称为“雾花”。",
    },
};
