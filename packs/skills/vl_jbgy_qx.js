import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterTarget: function (card, player, target) {
					return target != player && (!player.storage.vl_jbgy_qx || !player.storage.vl_jbgy_qx.includes(target))
				},
    mark: true,
    intro: {
        markcount: 0,
        content: "本回合内已对$发动过技能",
    },
    init: function (player, storage) {
					if (!player.storage.vl_jbgy_qx) player.storage.vl_jbgy_qx = []
				},
    content: function () {
					"step 0"
					if (!player.storage.vl_jbgy_qx || !player.storage.vl_jbgy_qx.includes(target)) {
						player.storage.vl_jbgy_qx.push(target)
					}
					if (player.countCards('he', { subtype: 'equip1' }) > 0) {
						player.chooseCard('是否弃置一张武器牌', 1, 'he', false, function (card) {
							return get.subtype(card) == 'equip1'
						}).set('ai', function (card) {
							return 7 - get.value(card)
						})
					} else {
						target.damage(1, player, 'fire')
						player.damage(1, 'nosource', 'fire')
						event.finish()
					}
					'step 1'
					if (result.bool) {
						player.discard(result.cards)
						target.damage(1, player, 'fire')
						player.damage(1, 'nosource', 'fire', 'unreal')
					} else {
						target.damage(1, player, 'fire')
						player.damage(1, 'nosource', 'fire')
					}
				},
    ai: {
        order: 8.5,
        result: {
            target: function (player, target) {
							if (!ui.selected.cards.length) {
								if (player.hp < 2) return 0;
								if (target.hp >= player.hp) return 0;
								if (player.countMark('vl_jbgy_ze') >= player.hp) return 0
							}
							return get.damageEffect(target, player);
						},
        },
        threaten: 1.5,
    },
    group: "vl_jbgy_qx_clean",
    subSkill: {
        clean: {
            trigger: {
                player: ["phaseBefore", "phaseAfter"],
            },
            forced: true,
            unique: true,
            content: function () {
							player.storage.vl_jbgy_qx = []
							player.updateMark('vl_jbgy_qx')
						},
            sub: true,
        },
    },
    t: {
        name: "侵袭",
        info: "出牌阶段，你可以（弃置一张武器牌）对一名本回合内未选择过的角色造成1点火焰伤害，然后你（视为）受到（过）1点火焰伤害。",
    },
};
