import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return ui.cardPile.childElementCount >= 4;
				},
    content: function () {
					'step 0'
					var cards = get.cards(4);
					player.addTempSkill("vl_delta_sy_ig")
					game.cardsGotoOrdering(cards);
					event.cards = cards
					var dialog = ui.create.dialog('算演', cards, true)
					event.dialog = dialog
					if (!event.isMine()) {
						player.popup('演算成功！');
						player.gain(cards, 'gain2').gaintag.add('vl_delta_sy')
						player.addTempSkill('vl_delta_sy_1')
						event.dialog.close()
						event.finish()
					}
					'step 1'
					event.list = []
					for (var i = 0; i < event.cards.length; i++) {
						event.list.push(get.number(event.cards[i]))
					}
					'step 2'
					player.chooseControl(event.list).set('prompt', '选择要算的第一个数字')
					'step 3'
					event.num1 = result.control
					event.list.splice(event.list.indexOf(event.num1), 1)
					player.chooseControl(event.list).set('prompt', '选择要算的第二个数字')
					'step 4'
					event.num2 = result.control
					event.list.splice(event.list.indexOf(event.num2), 1)
					player.chooseControl(['+', '-', '*', '/', '重做', '放弃']);
					'step 5'
					if (result.control == '+') {
						event.count = event.num1 + event.num2
					}
					if (result.control == '-') {
						event.count = event.num1 - event.num2
					}
					if (result.control == '*') {
						event.count = event.num1 * event.num2
					}
					if (result.control == '/') {
						event.count = event.num1 / event.num2
					}
					if (result.control == '重做') {
						event.goto(1);
					}
					if (result.control == '放弃') {
						player.loseToDiscardpile(event.cards)
						event.dialog.close()
						event.finish()
					}
					'step 6'
					event.list.push(event.count)
					'step 7'
					if (event.list.length != 1) {
						event.goto(2)
					}
					'step 8'
					if (event.list[0] == 24) {
						player.popup('演算成功！');
						player.gain(event.cards, 'gain2').gaintag.add('vl_delta_sy');
						event.dialog.close()
						player.addTempSkill('vl_delta_sy_1')
					} else {
						player.popup('演算失败！');
						player.loseToDiscardpile(event.cards)
						event.dialog.close()
						event.finish()
					}
				},
    ai: {
        order: 10,
        result: {
            player: 1,
        },
        threaten: 3.2,
    },
    subSkill: {
        "1": {
            shaRelated: true,
            popup: false,
            silent: true,
            charlotte: true,
            init: function (player) {
							player.markSkill('vl_delta_sy_1');
						},
            onremove: function (player) {
							player.unmarkSkill('vl_delta_sy_1');
						},
            trigger: {
                player: "useCardToTargeted",
            },
            intro: {
                content: "本回合你的【杀】无距离次数限制且无视防具。",
            },
            forced: true,
            filter: function (event, player) {
							return event.card.name == 'sha';
						},
            mod: {
                targetInRange: function (card, player, target, now) {
								if (card.name == 'sha') return true;
							},
                cardUsable: function (card, player, num) {
								if (card.name == 'sha') return Infinity
							},
            },
            logTarget: "target",
            content: function () {
							trigger.target.addTempSkill('qinggang2');
							trigger.target.storage.qinggang2.add(trigger.card);
						},
            ai: {
                skillTagFilter: function (player, tag, arg) {
								if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
								if (arg && arg.name == 'sha') return true;
							},
                unequip_ai: true,
            },
            sub: true,
        },
        ig: {
            mod: {
                ignoredHandcard: function (card, player) {
								if (card.hasGaintag('vl_delta_sy')) {
									return true;
								}
							},
                cardDiscardable: function (card, player, name) {
								if (name == 'phaseDiscard' && card.hasGaintag('vl_delta_sy')) {
									return false;
								}
							},
            },
            onremove: function (player) {
							player.removeGaintag('vl_delta_sy');
						},
            sub: true,
        },
    },
    t: {
        name: "算演",
        info: "出牌阶段限一次，你可以观看牌堆顶的四张牌并进行一次“「caclu」”，若成功：你获得这四张牌，你通过〖算演〗获得的牌不计入当前回合的手牌上限，然后本回合内你的【杀】无距离次数限制且无视防具，否则，你将这些牌置入弃牌堆。",
    },
};
