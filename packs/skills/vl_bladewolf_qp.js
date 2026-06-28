import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    shunfa: true,
    init(player) {
        player.initShunfaSkill('vl_bladewolf_qp')
    },
    filter(event, player) {
        return _status.currentPhase && _status.currentPhase != player && !player.getStorage('vl_bladewolf_qp_ai_roundcount', false)
    },
    round: 1,
    async content(event, trigger, player) {
        await _status.currentPhase.damage(1, player)
    },
    group: ["vl_bladewolf_qp_kill", "vl_bladewolf_qp_ai"],
    subSkill: {
        ai: {
            trigger: {
                global: ["damageAfter", "loseHpAfter", "recoverAfter", "phaseBegin", "drawAfter", "useCardAfter", "discardAfter"],
            },
            round: 1,
            filter(event, player) {
                return _status.currentPhase && _status.currentPhase != player &&
                    _status.currentPhase.hp == 1 && (_status.auto || !player.isUnderControl(true))
                    && get.attitude(player, _status.currentPhase) < 0 && get.damageEffect(_status.currentPhase, null, player, player) > 0;
            },
            forced: true,
            async content(event, trigger, player) {
                await _status.currentPhase.damage(1, player)
            },
        },
        kill: {
            trigger: {
                source: "dieAfter",
            },
            frequent: true,
            async content(event, trigger, player) {
                const roundname = 'vl_bladewolf_qp_roundcount';
                player.setStorage(roundname, null)
                delete player.syncStorage(roundname);
                player.unmarkSkill(roundname);
                const roundname2 = 'vl_bladewolf_qp_ai_roundcount';
                player.setStorage(roundname2, null)
                delete player.syncStorage(roundname2);
                player.unmarkSkill(roundname2);
            },
        },
    },
    t: {
        name: "潜破",
        info: `${get.poptip("shunfa")}，每轮限一次，你可以对不为自己的当前回合角色造成1点伤害；当你杀死角色后，你重置此技能。`,
    },
};
