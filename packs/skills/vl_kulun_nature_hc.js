import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const getUseCardHistoryEvent = (player, offset = 0) => {
    const history = player.getAllHistory ? player.getAllHistory("useCard") : player.getHistory("useCard");
    return history && history.length > offset ? history[history.length - 1 - offset] : null;
};

export default {
    trigger: {
        player: "useCardAfter",
    },
    direct: true,
    mark: true,
    intro: {
        mark(dialog, storage, player) {
						var usedCard = player.getHistory('useCard')
						var suits = usedCard.map(i => get.translation(get.suit(i.card))).unique()
						dialog.addText('本回合已经使用过的花色为：' + suits)
					},
    },
    async content(event, trigger, player) {
var useCards = player.getHistory('useCard')
        					var lastUsed = getUseCardHistoryEvent(player, 0)
        					var beforeUsed = useCards.slice(0, useCards.length - 1)
        					var num = beforeUsed.filter(i => i.card.suit == lastUsed.card.suit).length
        					if (!game.hasPlayer(function (current) {
        						return current.countCards('h') >= player.countCards('h') && current.countCards('h') > 0
        					})) {
        						return
        					}
        					if (num == 0) {
        						const result = await player.chooseTarget(get.prompt2('vl_kulun_nature_hc'), true, function (card, player, target) {
        							return target.countCards('h') >= player.countCards('h') && target.countCards('h') > 0
        						}).set('ai', function (target) {
        							return -get.attitude(player, target)
        						}).forResult()
        						const next = player.discardPlayerCard(result.targets[0], true, 'he')
        						result.targets[0].addVuff('zhongdu')
        						await next
        					} else {
        						return
        					}
    },
    t: {
        name: "天演",
        info: "你使用牌本回合未使用过的花色的牌后，弃置手牌数不小于你的角色的一张牌并令其获得1层「中毒」。",
    },
};
