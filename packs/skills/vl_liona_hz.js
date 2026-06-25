import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
    },
    init: function (player) { lib.skill.baonvezhi.change(player, 0) },
    direct: true,
    derivation: ["vl_liona_zz"],
    group: "vl_liona_hz_extra",
    filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return !current.hasSkill('vl_liona_zz');
					}) && player.storage.baonvezhi > 0;
				},
    content: function () {
					'step 0'
					player.chooseTarget([1, player.storage.baonvezhi], get.prompt('vl_liona_hz'), '令至多X名角色获得〖整战〗直到回合结束。', (card, player, target) => {
						return !target.hasSkill('vl_liona_zz');
					}).set('ai', target => get.attitude(player, target) - 2);
					'step 1'
					if (result.bool) {
						lib.skill.baonvezhi.change(player, -result.targets.length)
						for (var i = 0; i < result.targets.length; i++) {
							var target = result.targets[i]
							target.addTempSkill('vl_liona_zz', 'roundStart');
						}
					}
				},
    subSkill: {
        extra: {
            trigger: {
                global: "damageSource",
            },
            forced: true,
            locked: false,
            filter: function (event, player) {
							return event.source && event.source.hasSkill('vl_liona_zz') && event.source != player;
						},
            logTarget: "source",
            content: function () {
							lib.skill.baonvezhi.change(player, trigger.num);
						},
            sub: true,
        },
    },
    t: {
        name: "挥军",
        info: "①每轮开始时，你可以令至多X名角色获得技能「vl_liona_zz」直到本轮结束（X为你的「baonue」），然后你失去等量的暴虐值；②当其他角色造成伤害后，若其有「vl_liona_zz」，你获得等同于此次伤害值的暴虐值。",
    },
};
