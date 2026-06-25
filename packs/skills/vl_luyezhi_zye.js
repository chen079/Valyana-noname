import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
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
					return 7 - get.value(card)
				},
    filterTarget: true,
    selectTarget: function () {
					if (ui.selected.targets.length > ui.selected.cards.length) {
						game.uncheck('target');
					}
					return ui.selected.cards.length;
				},
    position: "he",
    content: function () {
					'step 1'
					if (target.isLinked()) {
						target.damage('fire', player)
					} else {
						target.link()
					}
				},
    ai: {
        order: 7,
        result: {
            target: function (target, player) {
							if (target == player) return 3
							else if (target.isLinked()) return -2
							else {
								return -0.5
							}
						},
        },
    },
    t: {
        name: "逐野",
        info: "出牌阶段限一次，你可以弃置任意张花色不同的牌并令等量名角色的武将牌横置。若该角色已横置，则改为对其造成1点火焰伤害。",
    },
};
