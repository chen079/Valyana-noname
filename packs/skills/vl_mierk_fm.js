import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: ["vl_mierk_fm_respond", "vl_mierk_fm_use"],
    subSkill: {
        respond: {
            trigger: {
                target: "useCardToTargeted",
            },
            prompt2: "当你成为【杀】的目标后，你可以与此【杀】使用者拼点，若你赢，此【杀】对你无效，否则，你获得拼点牌。",
            check: function (event, player) {
							return get.effect(player, event.card, event.player, player) < 0;
						},
            filter: function (event, player) {
							return event.card.name == 'sha' && player.canCompare(event.player)
						},
            logTarget: "player",
            content: function () {
							'step 0'
							player.when('chooseToCompareAfter').then(() => {
								if (trigger.num2 >= trigger.num1) {
									player.gain([trigger.card2, trigger.card1].filterInD('od'), 'gain2', 'log')
								}
							})
							player.chooseToCompare(trigger.player);
							'step 1'
							if (result.bool) {
								trigger.getParent().excluded.add(player);
							}
						},
            sub: true,
            _priority: 0,
        },
        use: {
            shaRelated: true,
            trigger: {
                player: "useCardToPlayered",
            },
            direct: true,
            filter: function (event, player) {
							return event.card.name == 'sha' && game.hasPlayer(current => current != event.target && current.canCompare(event.target))
						},
            logTarget: "target",
            content: function () {
							'step 0'
							player.chooseTarget('是否发动【讽蔑】？', function (card, player, target) {
								return target.canCompare(trigger.target)
							}).set('prompt2', '当你使用【杀】指定目标后，你可以选择一名除目标外的角色，然后令目标角色与该角色拼点，若该角色赢，此【杀】视为该角色使用且不可响应。')
								.set('ai', function (target) {
									if (get.attitude(trigger.target, player) > 0) {
										return -1
									} else if (trigger.target.hp <= 1) {
										return get.attitude(player, target)
									} else {
										return -get.attitude(player, target)
									}
								})
							'step 1'
							if (result.bool) {
								event.target = result.targets[0]
								event.target.chooseToCompare(trigger.target)
							} else {
								event.finish()
							}
							'step 2'
							if (result.winner == event.target) {
								if (event.target != player) {
									trigger.untrigger();
									trigger.getParent().player = event.target;
									game.log(event.target, '成为了', trigger.card, '的使用者');
									event.target.line(trigger.target)
								}
								trigger.getParent().directHit.add(trigger.target);
							}
						},
        },
    },
    ai: {
        directHit_ai: true,
        skillTagFilter: function (player, tag, arg) {
						if (player._vl_mierk_fm_temp) return false;
						player._vl_mierk_fm_temp = true;
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
						delete player._vl_mierk_fm_temp;
						return bool;
					},
        effect: {
            target: function (card, player, target, current) {
							if (card.name == 'sha' && current < 0) return 0.7;
						},
        },
    },
    _priority: 0,
    t: {
        name: "讽蔑",
        info: "①当你使用【杀】指定目标后，你可以选择一名除目标外的角色，然后令该角色与目标角色拼点，若该角色赢，此【杀】视为该角色使用且不可响应，②当你成为【杀】的目标后，你可以与此【杀】使用者拼点，若你赢，此【杀】对你无效，否则，你获得拼点牌。",
    },
};
