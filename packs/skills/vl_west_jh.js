import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    filter(event, player) {
					return player.countCards('he') > 0
				},
    direct: true,
    async content(event, trigger, player) {
const result = await player.chooseCardTarget({
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
        							let num = 0;
        							let att = get.attitude(player, target);
        							const draw = target.maxHp - target.countCards('h');
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
        					}).forResult()
if (result.bool) {
        						event.targets = result.targets[0];
        						const discardEvent = player.discard(result.cards[0])
        						player.logSkill('vl_west_jh', event.targets);
        						const drawEvent = result.targets[0].draw(Math.min(5, result.targets[0].maxHp))
        						await discardEvent;
        						await drawEvent;
        					}
        					else {
        						return;
        					}
const num = event.targets.countCards('h') - event.targets.maxHp;
        					if (num > 0) await event.targets.chooseToDiscard('h', true, num);
if (event.targets.isLinked()) {
        						await event.targets.link();
        					}
if (event.targets.isTurnedOver()) {
        						await event.targets.turnOver();
        					}
const cards = event.targets.getCards('j');
        					if (cards.length) {
        						await event.targets.discard(cards);
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
