import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    filter(event, player) {
					let list = [];
					game.getGlobalHistory('cardMove', function (evt) {
						if (evt.name == 'lose') {
							if (evt.position == ui.discardPile) {
								for (const i of evt.cards) list.add(i);
							}
						}
						else {
							if (evt.name == 'cardsDiscard') {
								for (const i of evt.cards) list.add(i);
							}
						}
					});
					list = list.filterInD('d')
					const suit = []
					for (let j = 0; j < list.length; j++) {
						const cardsuit = get.suit(list[j])
						if (!suit || !suit.includes(cardsuit)) {
							suit.push(cardsuit)
						}
					}
					if (suit.length == 4) {
						return true
					}
					return false
				},
    frequent: true,
    async content(event, trigger, player) {
        let list = [];
        					game.getGlobalHistory('cardMove', function (evt) {
        						if (evt.name == 'lose') {
        							if (evt.position == ui.discardPile) {
        								for (const i of evt.cards) list.add(i);
        							}
        						}
        						else {
        							if (evt.name == 'cardsDiscard') {
        								for (const i of evt.cards) list.add(i);
        							}
        						}
        					});
        					list = list.filterInD('d')
        					const suitsort = [[], [], [], []]
        					for (let j = 0; j < list.length; j++) {
        						const cardsuit = get.suit(list[j])
        						if (cardsuit == 'heart') {
        							suitsort[0].push(list[j])
        						} else if (cardsuit == 'diamond') {
        							suitsort[1].push(list[j])
        						} else if (cardsuit == 'spade') {
        							suitsort[2].push(list[j])
        						} else if (cardsuit == 'club') {
        							suitsort[3].push(list[j])
        						}
        					}
        					event.suitsort = suitsort
        					const suitResult = await player.chooseControl('heart', 'diamond', 'spade', 'club', 'cancel2').set('prompt', '请选择一种花色').set('choiceList', [get.translation(suitsort[0]), get.translation(suitsort[1]), get.translation(suitsort[2]), get.translation(suitsort[3])]).set('ai', function () {
        						let value1 = 0
        						let value2 = 0
        						let index = 0
        						for (let i = 0; i < 4; i++) {
        							for (let j = 0; j < suitsort[i].length; j++) {
        								value2 += get.value(suitsort[i][j])
        							}
        							if (value2 >= value1) {
        								value1 = value2
        								value2 = 0
        								index = i
        							}
        						}
        						return ['heart', 'diamond', 'spade', 'club'][index]
        					}).forResult()
        if (suitResult.control == 'cancel2') {
        						return
        					}
        					event.cards = event.suitsort[suitResult.index];
        					await player.gain(event.cards, 'gain2')
        while (event.cards.length) {
        const giveResult = await player.chooseCardTarget({
        						filterCard: function (card) {
        							return _status.event.getParent().cards.includes(card);
        						},
        						selectCard: [1, event.cards.length],
        						filterTarget: function (card, player, target) {
        							return player != target;
        						},
        						ai1: function (card) {
        							if (ui.selected.cards.length > 0) return -1;
        							if (card.name == 'du') return 20;
        							return (_status.event.player.countCards('h') - _status.event.player.hp);
        						},
        						ai2: function (target) {
        							const att = get.attitude(_status.event.player, target);
        							if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
        								return 1 - att;
        							}
        							return att - 4;
        						},
        						prompt: '请选择要送人的卡牌'
        					}).forResult();
        if (giveResult.bool) {
        						player.line(giveResult.targets, 'green');
        						const gainEvent = giveResult.targets[0].gain(giveResult.cards, player, 'giveAuto');
        						for (let i = 0; i < giveResult.cards.length; i++) {
        							event.cards.remove(giveResult.cards[i]);
        						}
        						await gainEvent;
        					} else {
        						break;
        					}
        }
        if (!event.cards.length) {
        						player.storage.vl_zeta_fg = ['basic', 'trick', 'equip']
        						player.updateMark('vl_zeta_fg')
        						const targetResult = await player.chooseTarget('令一名角色执行一个额外的出牌阶段').set('ai', function (target) {
        							const player = _status.event.target
        							return get.attitude(player, target)
        						}).forResult()
        						if (targetResult.bool) {
        							const next = targetResult.targets[0].phaseUse();
        							event.next.remove(next);
        							trigger.next.push(next);
        						}
        					} else {
        						return
        					}
    },
    t: {
        name: "固铸",
        info: `一名角色的回合结束时，若本回合有四种花色的牌进入过${get.poptip("center")}，你可以分配于弃牌堆的其中一种花色的牌。若你将这些牌全部分配给其他角色，你重置〖复归〗并令一名角色执行一个额外的出牌阶段。`,
    },
};
