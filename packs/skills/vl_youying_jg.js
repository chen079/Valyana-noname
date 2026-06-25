import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    locked: false,
    frequent: true,
    filter: (event, player) => {
					var evt = player.getLastAllUsed(1)
					if (!evt || !evt.card) return false
					return true
				},
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						var card = ''
						if (player.getLastAllUsed() && player.getLastAllUsed().card) {
							card = get.translation(player.getLastAllUsed().card)
						}
						dialog.addText('使用的上一张牌为：' + card)
					},
    },
    filterx: function (event) {
					if (event.targets.length == 0) return false;
					var type = get.type(event.card);
					if (type != 'basic' && type != 'trick') return false;
					return true;
				},
    content: function () {
					'step 0'
					var evt = player.getLastAllUsed(1)
					if (get.is.yayun(get.translation(trigger.card.name), get.translation(evt.card.name))) {
						player.draw()
						event.goto(2)
					} else {
						if (player.countCards('he') > 0) {
							player.chooseCard('he', 1, '是否重铸一张牌').set('ai', function (card) {
								return 8 - get.value(card)
							})
						} else {
							event.finish()
						}
					}
					'step 1'
					if (result.bool) {
						player.recast(result.cards)
					}
					'step 2'
					if (lib.skill.vl_youying_jg.filterx(trigger) && player.hasCard(card => get.is.yayun(get.translation(trigger.card.name), get.translation(card.name)), 'he')) {
						player.chooseToDiscard('he', function (card) {
							return get.is.yayun(get.translation(trigger.card.name), get.translation(card.name))
						}, get.prompt('vl_youying_jg')).set('ai', card => 4 - get.value(card))
							.set('prompt2', '弃置一张牌令' + get.translation(trigger.card) + '额外结算一次')
					} else {
						event.finish()
					}
					'step 3'
					if (result.bool) {
						trigger.effectCount++;
						game.log(trigger.card, '额外结算一次');
					}
				},
    mod: {
        aiOrder: function (player, card, num) {
						if (typeof card == 'object' && !get.tag(card, 'norepeat')) {
							var history = player.getAllHistory('useCard');
							if (history.length > 0) {
								var cardx = history[history.length - 1].card;
								if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) return num + 20;
							}
						}
					},
    },
    t: {
        name: "剑歌",
        info: "当你使用一张牌时，若此牌的牌名与你于本局游戏使用的上一张牌的牌名押韵，你可以摸一张牌，否则，你可以重铸一张牌；然后，你可以弃置一张与此牌名押韵的牌令其额外结算一次。",
    },
};
