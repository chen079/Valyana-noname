import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
					return player.countCards('he') > 0;
				},
    position: "he",
    complexCard: true,
    filterCard(card) {
					var type = get.type2(card);
					for (var i = 0; i < ui.selected.cards.length; i++) {
						if (get.type2(ui.selected.cards[i]) != type) return false;
					}
					return true;
				},
    complexTarget: true,
    selectCard() {
					var player = _status.event.player
					if (ui.selected.targets.length == 0) {
						var num = Math.max(...game.players.filter(i => i != player).map(i => i.countCards('he')))
						return [1, num]
					} else {
						return [1, ui.selected.targets[0].countCards('he')]
					}
				},
    filterTarget(card, player, target) {
					return target != player && target.countCards('he') >= ui.selected.cards.length && target.countCards('he') > 0
				},
    async content(event, trigger, player) {
					player.discardPlayerCard('he', cards.length, target)
				},
    t: {
        name: "风疾",
        info: "出牌阶段限一次，你可以弃置相同类型的任意张牌，并弃置一名其他角色的等量牌。",
    },
};
