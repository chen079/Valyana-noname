import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseJieshuBegin",
    },
    direct: true,
    async content(event, trigger, player) {
        const result = await player.chooseTarget(function (card, player, target) {
            return player != target;
        }).set('ai', function (target) {
            let player = _status.event.player;
            return get.attitude(player, target) + target == player.storage.vl_lucifer_cc ? 0 : 3;
        }).set('prompt', get.prompt('vl_lucifer_xz')).set('prompt2', '令一名其他角色获得【祝福】直到其回合结束。').forResult();
        if (result.bool) {
            result.targets[0].addTempSkill('vl_zhufu', { player: 'phaseEnd' });
        }
    },
    ai: {
        maixie: true,
    },
    group: "vl_lucifer_xz_hujia",
    subSkill: {
        hujia: {
            trigger: {
                player: "damageEnd",
            },
            direct: true,
            async content(event, trigger, player) {
                const result = await player.chooseTarget().set('ai', function (target) {
                    let player = _status.event.player;
                    if (player.storage.vl_lucifer_cc) {
                        return get.attitude(player, target) + (target == player.storage.vl_lucifer_cc) ? (7 - player.storage.vl_lucifer_cc.hujia) : 0;
                    } else {
                        return get.attitude(player, target);
                    }
                }).set('prompt', get.prompt('vl_lucifer_xz')).set('prompt2', '令一名角色获得1点护甲。').forResult();
                if (result.bool) {
                    result.targets[0].changeHujia(1, null, true);
                }
            },
        },
    },
    t: {
        name: "谐震",
        info: `结束阶段，你可以令一名其他角色获得${get.poptip("vl_zhufu")}直到其回合结束；当你受到伤害后，你可以令一名角色获得1点护甲。`,
    },
};
