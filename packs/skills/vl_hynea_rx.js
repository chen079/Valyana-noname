import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin2",
    },
    unique: true,
    dutySkill: true,
    forced: true,
    filter: function (event, player) {
					return !event.numFixed;
				},
    derivation: "vl_hynea_kb",
    content: function () {
					trigger.num += Math.ceil(player.storage.vl_hynea_cg / 2)
				},
    group: ["vl_hynea_rx_achieve", "vl_hynea_rx_fail"],
    subSkill: {
        achieve: {
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            filter: function (event, player) {
							return player.storage.vl_hynea_cg == 0
						},
            forced: true,
            skillAnimation: true,
            animationColor: "fire",
            content: function (event, player) {
							game.log(player, '成功完成使命');
							player.awakenSkill('vl_hynea_rx');
							player.removeSkill('vl_hynea_ds')
							player.addSkillLog('vl_hynea_kb')
						},
        },
        fail: {
            trigger: {
                player: "dying",
            },
            forced: true,
            content: function () {
							'step 0'
							game.log(player, '使命失败');
							player.awakenSkill('vl_hynea_rx');
							player.recover(3 - player.hp)
							'step 1'
							player.draw(3)
							player.loseMaxHp();
						},
            sub: true,
        },
    },
    t: {
        name: "入相",
        info: "使命技，①摸牌阶段，你多摸X张牌（X为你的「vl_hynea_cg」中[]内的数字的一半并向上取整）。②使命：准备阶段，若「vl_hynea_cg」中[]内的数字为0，你失去技能「vl_hynea_ds」并获得技能「vl_hynea_kb」。③失败：当你进入濒死状态时，你将体力回复至3点，然后你摸3张牌并减少1点体力上限。",
    },
};
