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
					trigger.player.addSkill('vl_mala_hy_damage')
					trigger.player.storage.vl_mala_hy_damage += 1
					"step 1"
					trigger.player.updateMark('vl_mala_hy_damage')
				},
    subSkill: {
        damage: {
            unique: true,
            init: function (player) {
							if (!player.storage.vl_mala_hy_damage) player.storage.vl_mala_hy_damage = 0;
						},
            filter: function (event, player) {
							return player.storage.vl_mala_hy_damage
						},
            mark: true,
            intro: {
                content: "出牌阶段结束时，你选择一项：1.弃置X张牌；2.受到X点火焰伤害（X为你的“魂焱”标记数）。",
            },
            forced: true,
            trigger: {
                player: "phaseUseEnd",
            },
            content: function () {
							"step 0"
							player.chooseToDiscard(player.storage.vl_mala_hy_damage).set('ai', function (card) {
								return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
							});
							"step 1"
							if (result.bool == false) {
								player.damage(player.storage.vl_mala_hy_damage, 'fire', 'nosource');
							}
						},
            sub: true,
        },
    },
    t: {
        name: "魂焱",
        info: "锁定技，当你对其他角色造成伤害后，该角色获得一个“魂焱”标记；每名角色的出牌阶段结束时，若其有“魂焱”，其须选择一项：1.弃置X张牌，2.受到X点火焰伤害；（X为其“魂焱”标记数）。",
    },
};
