import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
					return game.hasPlayer(function (current) {
						return current.hasSkill('vl_terz_ly')
					})
				},
    filterTarget(card, player, target) {
					return target.hasSkill('vl_terz_ly')
				},
    async content(event, trigger, player) {
        const target = event.target;
        const skill = 'vl_terz_ly'
        					if (!target.storage.vl_terz_ly) target.storage.vl_terz_ly = false
        					target.storage.vl_terz_ly = !target.storage.vl_terz_ly
        					target.popup(skill, 'wood');
        					game.log(target, '的', '#g【' + get.translation(skill) + '】', '发生了状态变更');
        					await game.delayx();
    },
    ai: {
        order: 8,
        result: {
            target(player, target) {
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
            filter(event, player) {
							return game.hasPlayer(function (current) {
								return current.hasSkill('vl_terz_ly')
							})
						},
            async content(event, trigger, player) {
                const result = await player.chooseTarget(lib.skill.vl_terz_fz.filterTarget, get.prompt('vl_terz_fz'), '变更一名角色的〖流域〗的状态').set('ai', function (target) {
        								const player = _status.event.player;
        								return get.effect(target, 'vl_terz_fz', player, player);
        							}).forResult();
                if (result.bool) {
        								const target = result.targets[0];
        								player.logSkill('vl_terz_fz', target);
        								const next = game.createEvent('vl_terz_fz');
        								next.player = player;
        								next.target = target;
        								next.setContent(lib.skill.vl_terz_fz.content);
        								await next;
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
