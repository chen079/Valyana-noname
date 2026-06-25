import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseUseBegin",
    },
    initList: function () {
					var list = lib.inpile.filter(i => get.type(i) == 'equip')
					list.addArray(['cixiong', 'fangtian', 'guanshi', 'hanbing', 'qilin', 'qinggang', 'qinglong', 'zhangba', 'zhuge', 'rewrite_zhuge',
						"rewrite_bagua", "rewrite_baiyin", "rewrite_lanyinjia", "rewrite_renwang", "tengjia", 'guding', 'zhuque', "bagua", "baiyin", "lanyinjia", "renwang", "tengjia",
						'dilu', 'jueying', 'zhuahuang', 'chitu', 'dawan', 'zixin', 'hualiu', 'muniu', 'bintieshuangji', 'wuxinghelingshan', 'wutiesuolian', 'wushuangfangtianji', 'chixueqingfeng',
						'huxinjing', 'guilongzhanyuedao', 'heiguangkai', 'linglongshimandai', 'hongmianbaihuapao', 'qimenbagua', 'guofengyupao', 'zhaogujing', 'sanlve', 'tianjitu',
						'taigongyinfu', 'shufazijinguan', 'xuwangzhimian'])
					return list.unique()
				},
    init: (player) => {
					if (!player.storage.vl_tails_qx) player.storage.vl_tails_qx = lib.skill['vl_tails_qx'].initList()

				},
    direct: true,
    content: function () {
					'step 0'
					var list = [
						'用任意张牌“制造”等量点数8的装备，将其中任意张置入场上的装备区（可替换）',
						'令任意名符合①的角色「迟缓」层数+1',
						'调整手牌至四张，结束本回合',
					];
					var next = player.chooseButton([
						'巧械：请选择依次执行任意项',
						[list.map((item, i) => {
							return [i, item];
						}), 'textbutton']
					]);
					next.set('selectButton', [1, 3]);
					next.set('ai', function (button) {
						var player = _status.event.player;
						switch (button.link) {
							case 0:
								if (get.attitude(player, _status.currentPhase) > 0) return 3;
								return 0;
							case 1:
								return 1;
							case 2:
								for (var i of ui.selected.buttons) {
									if (i.link == 1) num++;
								}
								if (num > 0 && player.isDamaged()) return 2;
								if (player.countCards('h') < 4) return 2
								return 0;
						}
					});
					'step 1'
					if (result.bool) {
						event.links = result.links.sort();
						for (var i of event.links) {
							game.log(player, '选择了', '#g【巧械】', '的', '#y选项' + get.cnNumber(i + 1, true));
						}
						if (event.links.includes(0) && player.countCards('he') > 0) {
							player.chooseCard('he', '用任意张牌“制造”等量点数8的装备，将其中任意张置入场上的装备区（可替换）', true, [1, player.countCards('he')]).set('ai', function (card) {
								if (player.countCards('he') <= 2) {
									return 5 - get.value(card)
								} else if (player.countCards('he') <= 4) {
									if (player.countCards('e') > 2) {
										if (get.subtype(card) == 'equip2') return -1
										else {
											if (ui.selected.cards.length > 1) return -1
											if (get.type(card) == 'equip') return 9 - get.value(card)
											return 5 - get.value(card)
										}
									} else {
										return 5 - get.value(card)
									}
								} else {
									if (get.subtype(card) == 'equip2') return -1
									if (ui.selected.cards.length > 1) return -1
									if (get.type(card) == 'equip') return 9 - get.value(card)
									return 4 - get.value(card)
								}
							})
						} else {
							event.goto(7)
						}
					} else {
						event.finish()
					}
					'step 2'
					event.allEquips = []
					event.cards = result.cards
					player.discard(result.cards)
					'step 3'
					event.card = event.cards.shift()
					var cards = player.storage.vl_tails_qx.randomGets(5).map(i => game.createCard(i, get.suit(event.card), 8))
					player.chooseCardButton(cards, '巧械：制造一件装备', 1, true).set('ai', function (button) {
						return get.value(button.link, _status.event.player);
					})
					'step 4'
					player.gain(result.links)
					player.storage.vl_tails_qx_destroy.push(result.links[0])
					event.allEquips.push(result.links[0])
					if (event.cards.length) {
						event.goto(3)
					}
					'step 5'
					player.chooseCardTarget({
						filterCard: function (card) {
							return event.allEquips.includes(card)
						},
						filterTarget: function (card, player, target) {
							return target.canEquip(card, true)
						},
						selectCard: 1,
						selectTarget: 1,
						ai1: function (card) {
							return 7 - get.useful(card, player);
						},
						ai2: function (target) {
							if (get.subtype(ui.selected.cards[0]) == 'equip2') return get.attitude(_status.event.player, target);
							var att = get.attitude(_status.event.player, target);
							if (target.countCards('e', function (card) {
								return get.number(card) == 8
							}) > 0) return -1
							return -att;
						},
						prompt: '将你的制造的牌置入一名角色的装备区（可替换）'
					})
					'step 6'
					if (result.bool) {
						player.$give(result.cards, result.targets[0], false);
						result.targets[0].equip(result.cards[0]);
						event.allEquips.remove(result.cards[0])
						if (event.allEquips.length) {
							event.goto(5)
						}
					}
					'step 7'
					if (event.links.includes(1) && game.hasPlayer(i => {
						return i.countCards('e', function (card) {
							return get.number(card) == 8
						}) > 0
					})) {
						player.chooseTarget('令任意名装备区含有点数为8装备的角色获得一层迟缓', [1, Infinity], function (card, player, target) {
							return target.countCards('e', function (card) {
								return get.number(card) == 8
							}) > 0
						}).set('ai', function (target) {
							return -get.attitude(player, target)
						})
					} else {
						event.goto(9)
					}
					'step 8'
					if (result.bool) {
						for (var i of result.targets) {
							i.addVuff('chihuan')
						}
					}
					'step 9'
					if (event.links.includes(2)) {
						var num = 4 - player.countCards('h')
						if (num > 0) {
							player.draw(num)
						} else if (num < 0) {
							player.chooseToDiscard(-num, 'h', true)
						}
						trigger.cancel()
						var evt = trigger.getParent('phase');
						if (evt && evt.name == 'phase') {
							game.log(evt.player, '结束了回合');
							evt.finish();
							evt.untrigger(true);
						}
					}
				},
    group: "vl_tails_qx_destroy",
    subSkill: {
        destroy: {
            trigger: {
                global: ["loseEnd", "cardsDiscardEnd"],
            },
            forced: true,
            charlotte: true,
            popup: false,
            onremove: true,
            init: (player) => {
							if (!player.storage.vl_tails_qx_destroy) player.storage.vl_tails_qx_destroy = []
						},
            filter: function (event, player) {
							if (event.name == 'lose' && event.position != ui.discardPile) return false;
							var storage = player.storage.vl_tails_qx_destroy;
							if (!storage) return false;
							for (var i of event.cards) {
								if (storage.includes(i)) return true;
							}
							return false;
						},
            content: function () {
							var cards = [];
							var storage = player.storage.vl_tails_qx_destroy;
							for (var i of trigger.cards) {
								if (storage.includes(i)) {
									storage.remove(i);
									cards.push(i);
								}
							}
							game.cardsGotoSpecial(cards);
							game.log(cards, '被移出了游戏');
						},
            sub: true,
            _priority: 0,
        },
    },
    ai: {
        viewHandcard: true,
        skillTagFilter: function (player, tag, arg) {
						if (player == arg) return false;
						if (arg.countCards('e', function (card) {
							return get.number(card) == 8
						}) <= 0) return false
					},
    },
    t: {
        name: "巧械",
        info: "①装备区有点数为8牌的角色，其手牌对你可见。②出牌阶段开始时，你可以执行任意几项：<li>1. 用任意张牌「zhizao」等量点数8的装备，将其中任意张置入场上的装备区（可替换）；<li>2. 令任意名符合①的角色「迟缓」+1；<li>3. 最后，调整手牌至四张，结束本回合。",
    },
};
