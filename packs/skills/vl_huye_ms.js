import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return player.countCards('he') > 0;
				},
    mod: {
        targetInRange: function (card, player, target) {
						if (target.hasVuff('sleep')) {
							return true;
						}
					},
    },
    filterTarget: function (card, player, target) {
					return target != player && !target.hasVuff('sleep');
				},
    filterCard: function (card) {
					var suit = get.suit(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.suit(ui.selected.cards[i]) == suit) return false;
					}
					return true;
				},
    complexCard: true,
    selectCard: [1, 4],
    check: function (card) {
					return 8 - get.value(card)
				},
    selectTarget: function () {
					return ui.selected.cards.length
				},
    contentBefore: function () {
					player.draw(cards.length)
				},
    content: function () {
					'step 0'
					target.chooseToRespond({ name: 'shan' }).set('ai', function (card) {
						if (_status.event.player.isImmVuff('sleep')) {
							return -1
						} else {
							return 1
						}
					})
					'step 1'
					if (!result.bool) target.addVuff('sleep');
				},
    ai: {
        order: function order(item,player){
						return get.order({name:"sha"})+1;
					},
        result: {
            target: function (player, target) {
							return Math.min(-0.1, -1 - target.countCards('h') + Math.sqrt(target.hp) / 2);
						},
        },
    },
    t: {
        name: "陷梦",
        info: "出牌阶段限一次，你可以弃置任意张花色不同手牌并摸等量的牌，然后令等量其他角色各打出一张【闪】，否则该角色进入「睡眠」状态；你对其使用牌无距离限制。",
    },
};
