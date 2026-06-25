import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["loseAfter", "loseAsyncAfter"],
    },
    direct: true,
    filter: function (event, player) {
					if (event.type != 'discard' || event.getlx === false) return false;
					var evt = event.getl(event.player);
					return evt && evt.hs && evt.hs.length > 0 && player.countCards('h') > 0;
				},
    content: function () {
					'step 0'
					if (game.hasPlayer(current => current.countCards('h') <= player.countCards('h'))) {
						player.chooseTarget(get.prompt('vl_yada_yy'), '选择一名手牌数不大于你的角色交换手牌，或点击取消交给其一张手牌并展示之，本回合其同花色手牌视为【毒】', function (card, player, target) {
							return target != player && target.countCards('h') <= player.countCards('h')
						}).set('ai', function (target) {
							return get.attitude(player, target) * Math.sqrt(target.countCards('h') + 1);
						});
					} else {
						event.goto(2)
					}
					'step 1'
					if (result.bool) {
						player.swapHandcards(result.targets[0]);
						event.finish()
					}
					'step 2'
					if (trigger.player != player) {
						player.chooseCard('h', get.prompt('vl_yada_yy')).set('ai', function (card) {
							if (get.attitude(player, trigger.player) < 0) {
								return 5 - get.value(card)
							} else {
								return -1
							}
						}).set('prompt2', '交给' + get.translation(trigger.player) + '一张手牌并展示之，本回合其同花色手牌视为【毒】')
					} else {
						event.finish()
					}
					'step 3'
					if (result.bool) {
						var card = result.cards[0]
						player.showCards(card)
						player.give(card, trigger.player)
						trigger.player.addTempSkill('vl_yada_yy_1')
						trigger.player.storage.vl_yada_yy_1 = get.suit(card)
					}
				},
    subSkill: {
        "1": {
            mod: {
                cardname: function (card, player) {
								if (card.suit == player.storage.vl_yada_yy_1) return 'du';
							},
            },
            mark: true,
            intro: {
                content: function (storage, player, skill) {
								return '你的' + get.translation(player.storage.vl_yada_yy_1) + '牌均视为【毒】直到回合结束。'
							},
            },
        },
    },
    t: {
        name: "夜影",
        info: "有角色的手牌被弃置后，你可以选择一项：\n\t\t\t<li>1. 与一名手牌不多于你的角色交换手牌；\n\t\t\t<li>2. 交给其一张手牌并展示之，本回合其同花色手牌视为【毒】",
    },
};
