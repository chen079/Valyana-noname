import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    usable: 1,
    filter(event, player) {
					if (player.storage.vl_death_sp) {
						return event.player != player
					} else {
						return event.player == player.storage.vl_death_sy
					}
				},
    mod: {
        targetInRange(card, player, target) {
						if (target == player.storage.vl_death_sy) {
							return true;
						}
					},
    },
    check(event, player) {
					return get.attitude(player, event.player) < 0
				},
    async content(event, trigger, player) {
        if (player.storage.vl_death_sp) {
        						trigger.num += 1
        						await player.gainPlayerCard(trigger.player, 'h', true)
        						return
        					}
        const result = await player.chooseControl().set('choiceList', ['①令此次对' + get.translation(trigger.player) + '造成的伤害+1', '②令' + get.translation(trigger.player) + '弃置两张牌', '③背水：失去1点体力']).forResult();
        if (result.index == 0) {
        						trigger.num += 1
        					} else if (result.index == 1) {
        						await trigger.player.chooseToDiscard('he', 2, true)
        					} else {
        						trigger.num += 1
        						await trigger.player.chooseToDiscard('he', 2, true)
        						await player.loseHp()
        					}
    },
    group: "vl_death_sl_double",
    subSkill: {
        double: {
            trigger: {
                player: "useCardToPlayered",
            },
            check(event, player) {
							return get.attitude(player, event.target) < 0
						},
            filter(event, player) {
							return event.card.name == 'sha' && event.getParent(2).name != 'vl_death_sl_double'
						},
            prompt2(event, player) {
							return '视为对' + get.translation(event.target) + '使用一张【杀】。'
						},
            async content(event, trigger, player) {
							await player.useCard({ name: 'sha' }, trigger.target)
						},
        },
    },
    t: {
        name: "双镰",
        info: "①每回合限一次，当你对“猎物”造成伤害时，你可以执行一项：1.令此次伤害+1；2.令该角色弃置两张牌；3.背水：你失去1点体力。②当你不因此技能使用【杀】指定目标后，你可以视为对目标使用一张【杀】。",
    },
};
