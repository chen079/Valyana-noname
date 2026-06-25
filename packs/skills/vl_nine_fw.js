import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "loseAfter",
        global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
    },
    filter: function (event, player) {
					var evt = event.getl(player);
					if (!lib.phaseName.some(i => Object.keys(event.getParent(i)).length > 0)) return false;
					return !player.hasSkill('vl_nine_fw_blocker') && evt && evt.cards2 && evt.cards2.length > 0
				},
    mark: true,
    intro: {
        content: "可以发动〖附尾〗",
    },
    onremove: function (player) {
					player.removeSkill('vl_nine_fw_blocker')
					player.unmarkSkill('vl_nine_fw')
				},
    cost: async function cost(event, trigger, player) {
					const phaseName = lib.phaseName.find(i => Object.keys(event.getParent(i)).length > 0);
					player.addTempSkill('vl_nine_fw_blocker', phaseName + 'After');
					event.result = await player.chooseBool(get.prompt2('vl_nine_fw')).set('ai', () => true).forResult();
					
				},
    content: async function content(event, trigger, player) {
					const cards1 = player.getCards('h');
					const cards2 = get.bottomCards(7);
					const used = [];
					const all = cards1.concat(cards2);
					const equips = all.filter(i => get.type(i) == 'equip');
					await game.cardsGotoOrdering(cards2);
					const videoId = lib.status.videoId++;
					game.broadcastAll(function (player, id, cards1, cards2) {
						var dialog = ui.create.dialog("牌堆底七张牌", cards2);
						if (cards1.length) {
							dialog.addText((player == game.me ? '你' : get.translation(player)) + '的手牌');
							dialog.add(cards1);
						}
						dialog.videoId = id;
					}, player, videoId, cards1, cards2);
					if (cards1){
						game.log(player, '展示了手牌');
						await player.showCards(cards1);
					}
					game.log(player, '展示了牌堆底七张牌');
					await player.showCards(cards2);
					let choice = ['交换']
					if (equips.length > 0) {
						choice.push('装备')
					}
					const result1 = await player.chooseControl(choice).set('ai', function () {
						return choice.randomGet()
					}).forResult();
					game.broadcastAll('closeDialog', event.videoId);
					if (result1.control == '装备'){
						const next = player.chooseCardButton(event.all, [1, event.equips.length], '附尾：使用其中任意张装备牌');
						next.set('filterButton', button => get.type(button.link) == 'equip');
						next.set('ai', button => 2 * Math.random() - 1);
						const result2 = next.forResult();
						if (result2.bool) {
							for (let card of result2.links) {
								await player.$draw();
								await player.chooseUseTarget(card, true);
								cards2.remove(card);
								used.push(card);
							}
						}
						for (let i = cards2.length - 1; i >= 0; i--) {
							cards2[i].fix();
							ui.cardPile.appendChild(cards2[i]);
						}
						game.updateRoundNumber();
					}
					else {
						const next = player.chooseToMove('附尾：将手牌和牌堆底七张牌交换');
						const list = [['牌堆底', cards2]];
						if (cards1.length) {
							list.push(['手牌', cards1]);
							next.set('filterMove', function (from, to) {
								return typeof to != 'number';
							});
						}
						next.set('list', list);
						next.set('processAI', function (list) {
							let cards;
							if(list[1]){cards = list[0][1].concat(list[1][1]);}
							else{cards = list[0][1];}
							cards = cards.sort(function (a, b) {
								return get.useful(a) - get.useful(b);
							}), cards2 = cards.splice(0, event.cards2.length);
							return [cards2, cards];
						});
						const result3 = await next.forResult();
						event.forceDie = true;
						if (result3.moved) {
							const pushs = result3.moved[0], gains = result3.moved[1];
							const push = result3.moved[0].slice(0);
							if (cards2.length) pushs.removeArray(cards2);
							if (cards1.length && gains) gains.removeArray(cards1);
							if (pushs.length) await player.lose(pushs, ui.cardPile);
							if (gains && gains.length) await player.gain(gains, 'draw');
							for (let i = push.length - 1; i >= 0; i--) {
								var card = push[i];
								if (!(('hejsdx').includes(get.position(card, true)))) {
									card.fix();
									ui.cardPile.appendChild(card);
								}
							}
						}
						game.updateRoundNumber();
					}
					if (!_status.currentPhase == player) return;
					const doing = all.slice(0).filter(i => !used.includes(i))
					const choicelist = [];
					choice = [];
					const choices = [];
					for (var i = 1; i <= 13; i++) {
						var cards = doing.filter(card => get.number(card) == i)
						if (cards.length) {
							choices.push(cards)
							choicelist.push(cards.map(card => get.translation(card)))
							choice.push('' + i)
						}
					}
					const result4 = await player.chooseControl(choice).set('choiceList', choicelist).set('ai', function () {
						return choice.randomGet()
					}).forResult();
					if (result4.control == 'cancel2') return;
					const done = choices.find(i => get.number(i[0]) == result4.control)
					await player.gain(done, 'gain2');
					const result5 = await player.chooseBool('是否重铸' + get.translation(done)).set('ai', () => true).forResult();
					if (result5.bool) {
						await player.recast(done);
					}
				},
    subSkill: {
        blocker: {
            charlotte: true,
            init: function (player) {
							player.unmarkSkill("vl_nine_fw");
						},
            onremove: function (player) {
							player.markSkill("vl_nine_fw");
						},
            sub: true,
        },
    },
    t: {
        name: "附尾",
        info: "每阶段限一次，你失去牌后，可以展示牌堆底7张牌和手牌，然后选择一项：①任意交换其中的顺序，②使用其中任意张装备；若为你的回合，你获得并可重铸其中未使用的、某点数的牌。",
    },
};
