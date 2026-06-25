import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardAfter",
    },
    direct: true,
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						var usedCard = player.getHistory('useCard')
						var suits = usedCard.map(i => get.translation(get.suit(i.card))).unique()
						dialog.addText('本回合已经使用过的花色为：' + suits)
					},
    },
    content: function () {
					'step 0'
					var useCards = player.getHistory('useCard')
					var lastUsed = player.getLastUsed()
					var beforeUsed = useCards.slice(0, useCards.length - 1)
					var num = beforeUsed.filter(i => i.card.suit == lastUsed.card.suit).length
					if (!game.hasPlayer(function (current) {
						return current.countCards('h') >= player.countCards('h') && current.countCards('h') > 0
					})) {
						event.finish()
					}
					if (num == 0) {
						player.chooseTarget(get.prompt2('vl_kulun_nature_hc'), true, function (card, player, target) {
							return target.countCards('h') >= player.countCards('h') && target.countCards('h') > 0
						}).set('ai', function (target) {
							return -get.attitude(player, target)
						})
					} else {
						event.finish()
					}
					'step 1'
					player.discardPlayerCard(result.targets[0], true, 'he')
					result.targets[0].addVuff('zhongdu')
				},
    t: {
        name: "天演",
        info: "你使用牌本回合未使用过的花色的牌后，弃置手牌数不小于你的角色的一张牌并令其获得1层「中毒」。",
    },
};
