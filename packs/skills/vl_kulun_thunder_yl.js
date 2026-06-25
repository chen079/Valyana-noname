import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterCard: true,
    selectCard: 1,
    usable: 1,
    filter: function filter(event,player){
					return game.hasPlayer(current => current != player);
				},
    content: function () {
					'step 0'
					event.targets = game.filterPlayer(current => current != player)
					event.targets.sortBySeat(player)
					event.num = 0
					event.cards = cards
					'step 1'
					event.target = event.targets.shift()
					event.target.chooseToRespond('请打出一张点数为' + get.number(event.cards[0]) + '或花色为' + get.translation(get.suit(event.cards[0])) + '的牌，否则' + get.translation(player) + '对你造成1点伤害。', function (card) {
						return get.number(card) == get.number(event.cards[0]) || get.suit(card) == get.suit(event.cards[0])
					}).set('ai', function (card) {
						if (get.attitude(event.target, player) > 0) {
							return 5 - get.value(card)
						} else {
							return 7 - get.value(card)
						}
					})
					'step 2'
					if (result.bool) {
						event.cards = result.cards
					} else {
						event.target.damage(player, 'thunder')
						event.num++
					}
					'step 3'
					if (event.targets.length) {
						game.delay()
						event.goto(1)
					}
				},
    ai: {
        order: 7,
        result: {
            player: 2,
            target: -2,
        },
    },
    t: {
        name: "阴雷",
        info: "出牌阶段限一次，你可以弃置一张手牌，令所有其他角色打出一张与上一名因此技能打出或弃置的牌点数或花色相同的牌，否则你对其造成1点雷电伤害。",
    },
};
