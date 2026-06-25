import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    filter: function (event, player) {
					return event.player != player
				},
    forced: true,
    content: function () {
					"step 0"
					trigger.player.addSkill('vl_dragon_hy_damage')
					trigger.player.storage.vl_dragon_hy_damage += 1
					trigger.player.loseMaxHp()
					"step 1"
					trigger.player.updateMark('vl_dragon_hy_damage')
				},
    subSkill: {
        damage: {
            unique: true,
            init: function (player) {
							if (!player.storage.vl_dragon_hy_damage) player.storage.vl_dragon_hy_damage = 0;
						},
            filter: function (event, player) {
							return player.storage.vl_dragon_hy_damage
						},
            mark: true,
            intro: {
                content: "结束阶段，你选择一项：1.弃置X张牌；2.受到X点火焰伤害（X为你的“黑焰”标记数）。",
            },
            forced: true,
            trigger: {
                player: "phaseUseEnd",
            },
            content: function () {
							"step 0"
							player.chooseToDiscard('he', player.storage.vl_dragon_hy_damage).set('ai', function (card) {
								if (card.name == 'tao') return -10;
								if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
								return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
							});
							"step 1"
							if (result.bool == false) {
								player.damage(player.storage.vl_dragon_hy_damage, 'fire', 'nosource');
							}
							player.gainMaxHp(player.storage.vl_dragon_hy_damage)
							player.storage.vl_dragon_hy_damage = 0
							player.removeSkill('vl_dragon_hy_damage')
						},
            sub: true,
        },
    },
    t: {
        name: "黑焰",
        info: "锁定技，当你对其他角色造成伤害后，该角色获得一个“黑焰”标记并减少1点体力上限；每名角色的出牌阶段结束时，若其有“黑焰”，其须选择一项：1.弃置X张牌，2.受到X点火焰伤害；然后移除所有“黑焰”标记并增加X点体力上限（X为其“黑焰”标记数）。",
    },
};
