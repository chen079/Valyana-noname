import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    filter: function (event, player) {
					return player.countCards('he') > 0
				},
    content: function () {
					'step 0'
					player.chooseToDiscard([1, Infinity], 'he', get.prompt2('vl_nine_cj')).set('ai', function (card) {
						return 7 - get.value(card)
					}).set('filterCard', function (card) {
						var type = get.type2(card);
						for (var i = 0; i < ui.selected.cards.length; i++) {
							if (get.type2(ui.selected.cards[i]) != type) return false;
						}
						return true;
					}).set('complexCard', true)
					'step 1'
					if(!game.hasPlayer(c => c.countDiscardableCards(player, "he") && c!=player)) event.finish()
					if (result.bool) {
						event.num = result.cards.length
						player.chooseTarget('令一名角色弃置' + get.cnNumber(event.num) + '张牌', function (card, player, target) {
							return target.countCards('he') > 0 && target != player;
						}, true).set('ai', function (target) {
							return -get.attitude(_status.event.player, target) * (target.countCards('e') + 1);
						});
					} else {
						event.finish()
					}
					'step 2'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.discardPlayerCard(event.num, target, true);
					}
					'step 3'
					var cards = player.getCards('e');
					if (cards.length > 0) {
						player.chooseBool('是否重铸装备区所有牌，对' + get.translation(event.target) + '使用任意张【杀】或令护甲加到1。')
					} else {
						event.finish()
					}
					'step 4'
					if (result.bool) {
						var cards = player.getCards('e');
						player.recast(cards)
						var choice = ['护甲']
						var choicelist = ['令护甲加到1。']
						if (player.countCards('hs', 'sha') > 0) {
							choice.push('出杀')
							choicelist.push('对' + get.translation(event.target) + '使用任意张【杀】')
						}
						player.chooseControl(choice).set('ai', function () {
							var player = _status.event.player
							if (get.attitude(player, event.target) > 0) {
								return '护甲'
							} else {
								if (player.countCards('hs', 'sha') > 0) {
									return '出杀'
								} else {
									return '护甲'
								}
							}
						}).set('choiceList', choicelist)
					} else {
						event.finish()
					}
					'step 5'
					if (result.control == '护甲') {
						if (player.hujia < 1) {
							player.changeHujia(1,null,true)
						}
						event.finish()
					}
					'step 6'
					if (player.countCards('hs', 'sha') > 0) {
						player.chooseToUse('hs', event.target, function (card, player, event) {
							return get.name(card) == 'sha'
						}, '冲击：是否对' + get.translation(event.target) + '使用一张杀？')
					}
					'step 7'
					if (result.bool && player.countCards('hs', 'sha') > 0) {
						event.goto(6)
					}
				},
    t: {
        name: "冲击",
        info: "每回合结束时，你可以弃置任意张同类型的牌，并弃置另一角色的等量牌，然后可以重铸装备区所有牌，若如此做，你对其使用任意张【杀】或令护甲加到1。",
    },
};
