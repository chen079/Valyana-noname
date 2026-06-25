import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToTargeted",
    },
    filter(event, player) {
					return event.card.name == 'sha' && player.canCompare(event.target)
				},
    check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
    async content(event, trigger, player) {
const result = await player.chooseToCompare(trigger.target).forResult();
var card = get.color(result.player, player)
        					if (card == 'red') {
        						trigger.getParent().directHit.add(trigger.target)
        					} else if (card == 'black') {
        						var id = trigger.target.playerid;
        						var map = trigger.customArgs;
        						if (!map[id]) map[id] = {};
        						if (!map[id].extraDamage) map[id].extraDamage = 0;
        						map[id].extraDamage++;
        					}
if (result.bool) {
        						const cardResult = await trigger.target.chooseCard('交给' + get.translation(player) + '一张牌', 'he', true).set('ai', function (card) {
        							return 100 - get.value(card);
        						}).forResult();
        						if (cardResult.cards) await player.gain(cardResult.cards, trigger.target, 'giveAuto');
        					}
    },
    ai: {
        directHit_ai: true,
        skillTagFilter(player, tag, arg) {
						if (player._vl_krikt_ly_temp) return false;
						player._vl_krikt_ly_temp = true;
						var bool = function () {
							if (arg.card.name != 'sha' || get.attitude(player, arg.target) >= 0 || !arg.target.countCards('h')) return false;
							if (arg.target.countCards('h') == 1 && (!arg.target.getEquip('bagua') || player.hasSkillTag('unequip', false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card
							}) || player.hasSkillTag('unequip_ai', false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card
							}))) return true;
							return player.countCards('h', function (card) {
								return card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) <= 4 && (get.number(card) >= (11 + arg.target.countCards('h') / 2) || get.suit(card, player) == 'heart');
							}) > 0;
						}();
						delete player._vl_krikt_ly_temp;
						return bool;
					},
        effect: {
            target(card, player, target, current) {
							if (card.name == 'sha' && current < 0) return 0.7;
						},
        },
    },
    t: {
        name: "两仪",
        info: "当你使用【杀】指定目标后，你可以与该角色拼点。若你的拼点牌为红色，此【杀】不可闪避，若你的拼点牌为黑色，此【杀】伤害+1；若你赢，目标角色须交给你一张牌。",
    },
};
