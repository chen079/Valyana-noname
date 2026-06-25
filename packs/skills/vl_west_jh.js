import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    filter: function (event, player) {
					return player.countCards('he') > 0
				},
    direct: true,
    content: function () {
					"step 0"
					player.chooseCardTarget({
						filterCard: function (card, player) {
							return lib.filter.cardDiscardable(card, player);
						},
						selectCard: 1,
						filterTarget: true,
						prompt: get.prompt2('vl_west_jh'),
						ai1: function (card) {
							return 10 - get.value(card);
						},
						ai2: function (target) {
							var num = 0;
							var att = get.attitude(player, target);
							var draw = target.maxHp - target.countCards('h');
							if (draw >= 0) {
								if (target.hasSkillTag('nogain')) att /= 6;
								if (att > 2) {
									num += Math.sqrt(draw + 1) * att;
								}
								num += att / 3;
							}
							if (draw < -1) {
								if (target.hasSkillTag('nogain')) att *= 6;
								if (att < -2) {
									num -= Math.sqrt(1 - draw) * att;
								}
							}
							if (att > 0) {
								if (target.isMinHp()) {
									num += 5;
								}
								if (target.isTurnedOver()) {
									num += 5;
								}
								if (target.countCards('j')) {
									num += 2;
								}
								if (target.isLinked()) {
									num++;
								}
								if (num > 0) {
									return num + att;
								}
							}
							return num;
						}
					})
					"step 1"
					if (result.bool) {
						event.targets = result.targets[0];
						player.discard(result.cards[0])
						player.logSkill('vl_west_jh', event.targets);
						result.targets[0].draw(Math.min(5, result.targets[0].maxHp))
					}
					else {
						event.finish();
					}
					'step 2'
					var num = event.targets.countCards('h') - event.targets.maxHp;
					if (num > 0) event.targets.chooseToDiscard('h', true, num);
					"step 3"
					if (event.targets.isLinked()) {
						event.targets.link();
					}
					"step 4"
					if (event.targets.isTurnedOver()) {
						event.targets.turnOver();
					}
					"step 5"
					var cards = event.targets.getCards('j');
					if (cards.length) {
						event.targets.discard(cards);
					}
				},
    ai: {
        expose: 0.2,
        threaten: 1.3,
    },
    t: {
        name: "净化",
        info: "回合开始时，你可以弃置一张手牌，然后选择一名角色，该角色：①复原武将牌，②弃置判定区内的所有牌，③摸X张牌，然后将手牌弃置至X张（X为其体力上限且至多为5）。",
    },
};
