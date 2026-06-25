import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    chargeSkill: true,
    filter(event, player) {
					return player.countMark('charge') > 0 && event.player != player
				},
    async content(event, trigger, player) {
					const result = await player.chooseTarget(1, '对一名其他角色造成1点伤害。', function (card, player, target) {
						return target != player
					}).set('ai', function (target) {
						return -get.attitude(player, target)
					}).forResult();
					if (result.bool) {
						player.removeMark('charge', 1);
						result.targets[0].damage(1, player)
					}
    },
    group: ["vl_qima_dz_damage", "vl_qima_dz_init", "vl_qima_dz_1"],
    subSkill: {
        "1": {
            trigger: {
                source: "damageBegin2",
            },
            direct: true,
            filter(event, player) {
							return event.player != player && event.player.hp == 1
						},
            async content(event, trigger, player) {
							trigger.num += 1
						},
        },
        init: {
            trigger: {
                global: "phaseBefore",
                player: "enterGame",
            },
            forced: true,
            locked: false,
            filter(event, player) {
							return (event.name != 'phase' || game.phaseNumber == 0) && player.countMark('charge') < 4;
						},
            async content(event, trigger, player) {
							player.addMark('charge', Math.min(2, 4 - player.countMark('charge')));
						},
            sub: true,
        },
        damage: {
            trigger: {
                global: "dying",
                player: ["damageEnd"],
            },
            filter(event, player) {
							if (event.name != 'damage') return event.player != player;
							return true;
						},
            direct: true,
            async content(event, trigger, player) {
							const num = Math.min(1, 4 - player.countMark('charge'));
							if (num > 0) {
								player.logSkill('vl_qima_dz_damage');
								player.addMark('charge', num);
								game.delayx();
							}
						},
        },
    },
    t: {
        name: "断斩",
        info: `${get.poptip("truexuli")}（2/4），当你对其他角色造成伤害后，你可以减少1点蓄力点，然后对一名其他角色造成1点伤害。其他角色进入濒死状态时或当你受到伤害后，你获得1点蓄力点。锁定技，当你对一名体力值为1的其他角色造成伤害时，你令此伤害+1。`,
    },
};
