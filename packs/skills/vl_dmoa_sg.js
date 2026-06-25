import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    filter: (event, player) => player.countCards('h') > 0 && player.storage.vl_dmoa_sg !== '' && player.storage.vl_dmoa_sg,
    direct: true,
    init: (player) => {
					player.storage.vl_dmoa_sg = ''
				},
    content: () => {
					'step 0'
					player.chooseCard('h', get.prompt2("vl_dmoa_sg")).set('ai', function (card) {
						if (player.storage.vl_dmoa_sg === '点数不大于其') {
							return get.number(card)
						} else if (player.storage.vl_dmoa_sg === '点数不小于其') {
							return 14 - get.number(card)
						} else if (player.storage.vl_dmoa_sg === '颜色与其不同') {
							return Math.random()
						} else if (player.storage.vl_dmoa_sg === '类型与其相同') {
							if (get.type(card) == 'basic') {
								return 4
							} else {
								return 5 * Math.random()
							}
						} else {
							return Math.random()
						}
					})
					'step 1'
					if (result.bool) {
						event.cards = [];
						event.card = result.cards[0]
						player.showCards(result.cards)
					} else {
						event.finish()
					}
					'step 2'
					if (player.storage.vl_dmoa_sg) {
						player.judge(function (result) {
							var evt = _status.event.getParent('vl_dmoa_sg');
							if (player.storage.vl_dmoa_sg === '点数不大于其') {
								if (evt && evt.card && get.number(evt.card) < get.number(result)) return 0;
							} else if (player.storage.vl_dmoa_sg === '点数不小于其') {
								if (evt && evt.card && get.number(evt.card) > get.number(result)) return 0;
							} else if (player.storage.vl_dmoa_sg === '颜色与其不同') {
								if (evt && evt.card && get.color(evt.card) == get.color(result)) return 0;
							} else if (player.storage.vl_dmoa_sg === '类型与其相同') {
								if (evt && evt.card && get.type2(evt.card) != get.type2(result)) return 0;
							}
							return 1;
						}).set('callback', () => {
							'step 0'
							var evt = event.getParent(2);
							event.getParent().orderingCards.remove(event.judgeResult.card);
							evt.cards.push(event.judgeResult.card);
							evt.card = event.judgeResult.card
							if (event.getParent().result.bool) {
								event.getParent(2).redo();
							} else event._result = { bool: false };
						}).judge2 = function (result) {
							return result.bool ? true : false;
						};
					} else event.finish()
					'step 3'
					var cards = cards.filterInD();
					if (cards.length) player.chooseTarget('将' + get.translation(cards) + '交给一名角色', true).set('ai', function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
						if (target.hasSkillTag('nogain')) att /= 10;
						return att;
					});
					else event.finish();
					'step 4'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.line(target, 'green');
						target.gain(cards, 'gain2').giver = player;
					}
					else event.finish();
				},
    ai: {
        order: 9,
        result: {
            player: 1,
        },
    },
    _priority: 0,
    mark: true,
    intro: {
        markcount: () => undefined,
        content: "当前的笙歌条件为#",
    },
    group: "vl_dmoa_sg_choose",
    subSkill: {
        choose: {
            trigger: {
                player: ["phaseBegin", "phaseEnd"],
            },
            direct: true,
            content: () => {
							'step 0'
							event.choiceList = ['点数不大于其', '点数不小于其', '颜色与其不同', '类型与其相同']
							var choice = ['选项一', '选项二', '选项三', '选项四']
							player.chooseControl(choice).set('choiceList', event.choiceList)
								.set('prompt2', '请选择你的“笙歌”条件')
								.set('ai', function () {
									return choice.randomGet()
								})
							'step 1'
							game.log(player, '选择的', '#g【笙歌】', '条件为', '#b' + event.choiceList[result.index])
							player.storage.vl_dmoa_sg = event.choiceList[result.index]
						},
        },
    },
    t: {
        name: "笙歌",
        info: "回合开始或结束时，你选择一项（代替上一次的选择）。准备阶段，你可以展示一张手牌并重复进行判定，直到判定牌对此上一张展示或判定的牌不满足“笙歌”条件或缺少条件。然后令一名角色获得这些判定牌。条件：<li>1.点数不大于其；<li>2.点数不小于其；<li>3.颜色与其不同；<li>4.类型与其相同。",
    },
};
