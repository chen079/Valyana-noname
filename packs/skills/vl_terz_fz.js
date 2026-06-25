import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return game.hasPlayer(function (current) {
						return current.hasSkill('vl_terz_ly')
					})
				},
    filterTarget: function (card, player, target) {
					return target.hasSkill('vl_terz_ly')
				},
    content: function () {
					'step 0'
					var skill = 'vl_terz_ly'
					if (!target.storage.vl_terz_ly) target.storage.vl_terz_ly = false
					target.storage.vl_terz_ly = !target.storage.vl_terz_ly
					target.popup(skill, 'wood');
					game.log(target, '的', '#g【' + get.translation(skill) + '】', '发生了状态变更');
					game.delayx();
				},
    ai: {
        order: 8,
        result: {
            target: function (player, target) {
							return target.storage.vl_terz_ly ? -1 : 1;
						},
        },
    },
    group: "vl_terz_fz_damage",
    subSkill: {
        damage: {
            trigger: {
                player: ["damageEnd"],
                source: "damageSource",
            },
            direct: true,
            filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return current.hasSkill('vl_terz_ly')
							})
						},
            content: function () {
							'step 0'
							player.chooseTarget(lib.skill.vl_terz_fz.filterTarget, get.prompt('vl_terz_fz'), '变更一名角色的〖流域〗的状态').set('ai', function (target) {
								var player = _status.event.player;
								return get.effect(target, 'vl_terz_fz', player, player);
							});
							'step 1'
							if (result.bool) {
								var target = result.targets[0];
								player.logSkill('vl_terz_fz', target);
								var next = game.createEvent('vl_terz_fz');
								next.player = player;
								next.target = target;
								next.setContent(lib.skill.vl_terz_fz.content);
							}
						},
            sub: true,
        },
    },
    t: {
        name: "复攥",
        info: "出牌阶段限一次/当你受到伤害后/当你对其他角色造成伤害后，你可选择一名拥有〖流域〗的角色，变更其〖流域〗的状态。",
    },
};
