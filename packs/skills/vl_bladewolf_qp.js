import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    shunfa: true,
    init: function (player) {
					player.initShunfaSkill('vl_bladewolf_qp')
				},
    filter: function (event, player) {
					return _status.currentPhase && _status.currentPhase != player && !player.storage.vl_bladewolf_qp_ai_roundcount
				},
    round: 1,
    content: function () {
					_status.currentPhase.damage(1, player)
				},
    group: ["vl_bladewolf_qp_kill", "vl_bladewolf_qp_ai"],
    subSkill: {
        ai: {
            trigger: {
                global: ["damageAfter", "loseHpAfter", "recoverAfter", "phaseBegin", "drawAfter", "useCardAfter", "discardAfter"],
            },
            round: 1,
            filter: function (event, player) {
							return _status.currentPhase && _status.currentPhase != player &&
								_status.currentPhase.hp == 1 && (_status.auto || !player.isUnderControl(true))
								&& get.attitude(player, _status.currentPhase) < 0 && get.damageEffect(_status.currentPhase, null, player, player) > 0;
						},
            forced: true,
            content: function () {
							_status.currentPhase.damage(1, player)
						},
        },
        kill: {
            trigger: {
                source: "dieAfter",
            },
            frequent: true,
            content: function () {
							var roundname = 'vl_bladewolf_qp_roundcount';
							delete player.storage[roundname]
							delete player.syncStorage(roundname);
							player.unmarkSkill(roundname);
							var roundname = 'vl_bladewolf_qp_ai_roundcount';
							delete player.storage[roundname]
							delete player.syncStorage(roundname);
							player.unmarkSkill(roundname);
						},
        },
    },
    t: {
        name: "潜破",
        info: "「shunfa」，每轮限一次，你可以对不为自己的当前回合角色造成1点伤害；当你杀死角色后，你重置此技能。",
    },
};
