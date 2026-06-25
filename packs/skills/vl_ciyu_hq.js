import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageBegin3",
    },
    locked: true,
    usable: 1,
    filter: function (event, player) {
					return event.player.isAlive() && event.player.getExpansions('vl_xieji').length != 0
				},
    prompt2: "当一名有“协“的角色受到伤害时，你可以令其选择是否弃置一张“协”并免除此伤害",
    logTarget: "player",
    check: function (event, player) {
					return get.attitude(player, event.player) > 0
				},
    content: function () {
					"step 0"
					trigger.player.chooseCardButton('选择弃置一张“协”', 1, trigger.player.getExpansions('vl_xieji')).set('prompt2', "是否弃置一张“协”并免除此次伤害").set("ai", ai = function (button) {
						return 9 - get.value(button.link);
					})
					"step 1"
					var card = result.links
					if (result.bool) {
						trigger.player.loseToDiscardpile(card)
						trigger.cancel()
					} else {
						event.finish()
						return;
					}
				},
    group: "vl_ciyu_hq_self",
    subSkill: {
        self: {
            trigger: {
                target: "useCardToTarget",
            },
            forced: true,
            filter: function (event, player) {
							if (event.card.name != 'sha') return false;
							if (player.countCards('he') == 0) return false;
							return game.hasPlayer(function (current) {
								return current != event.player && current != player &&
									current.getExpansions('vl_xieji').length != 0 && lib.filter.targetEnabled(event.card, event.player, current);
							});
						},
            ai: {
                combo: "vl_ciyu_hq",
            },
            content: function () {
							"step 0"
							var next = player.chooseCardTarget({
								position: 'he',
								filterCard: lib.filter.cardDiscardable,
								filterTarget: function (card, player, target) {
									var trigger = _status.event;
									if (target != player && target != trigger.source) {
										if (target.getExpansions('vl_xieji').length != 0 && lib.filter.targetEnabled(trigger.card, trigger.source, target)) return true;
									}
									return false;
								},
								ai1: function (card) {
									return get.unuseful(card) + 9;
								},
								ai2: function (target) {
									if (target.hp == 1) {
										return -1
									}
									if (target.countCards('h', 'shan')) {
										return target.countCards('h', 'shan') + target.getExpansions('vl_xieji').length;
									}
									return target.getExpansions('vl_xieji').length;
								},
								prompt: get.prompt('vl_ciyu_hq'),
								prompt2: '弃置一张牌，将此【杀】转移给一名有“协”的角色',
								source: trigger.player,
								card: trigger.card,
							});
							"step 1"
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill(event.name, target);
								player.discard(result.cards);
								var evt = trigger.getParent();
								evt.triggeredTargets2.remove(player);
								evt.targets.remove(player);
								evt.targets.push(target);
							}
						},
            sub: true,
        },
    },
    t: {
        name: "护全",
        info: "锁定技。每回合限一次，当有角色受到伤害时，若其有“协”，你可以令其选择是否弃置一张“协”并免除此伤害；当你成为【杀】的目标时，你可弃置一张牌将此【杀】转移给一名有“协”且不是此【杀】使用者的其他角色。",
    },
};
