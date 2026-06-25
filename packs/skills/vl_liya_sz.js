import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    mod: {
        targetInRange: function (card, player, target) {
						return true;
					},
    },
    locked: false,
    frequent: true,
    filter: function (event, player) {
					return event.source && event.source.isIn() && event.source != player
				},
    check: function (event, player) {
					return get.attitude(player, event.source) < 0
				},
    content: function () {
					trigger.source.addSkill('vl_liya_sz_far')
					trigger.source.markSkill('vl_liya_sz_far')
				},
    ai: {
        maixie_defend: true,
    },
    subSkill: {
        far: {
            trigger: {
                player: "recoverEnd",
            },
            forced: true,
            popup: false,
            charlotte: true,
            filter: function (event, player) {
							return event.num > 0;
						},
            content: function () {
							player.removeSkill('vl_liya_sz_far');
						},
            mod: {
                cardname: function (card, player, name) {
								if (lib.card[card.name].type == 'trick') return 'sha';
							},
                attackRange: function attackRange(player, num) {
								return 0;
							},
                globalFrom: function (from, to, current) {
								return current + game.countPlayer();
							},
            },
            ai: {
                effect: {
                    target: function (card, player, target, current) {
									if (get.tag(card, 'respondSha') && current < 0) return 0.6
								},
                },
                respondSha: true,
            },
            sub: true,
            mark: true,
            intro: {
                content: "攻击范围为0，计算与其他角色的距离+X，且你普通锦囊牌均视为【杀】",
            },
        },
    },
    t: {
        name: "闪转",
        info: "你使用牌无距离限制；当你受到伤害后，你可以令伤害来源的攻击距离始终为0，其计算与其他角色的距离+X（X为场上角色数）且其普通锦囊牌均视为【杀】，直到其回复体力。",
    },
};
