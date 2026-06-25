import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    skillAnimation: true,
    animationColor: "orange",
    init(player) {
        if (!player.storage.vl_zhan_jf) player.storage.vl_zhan_jf = 0
    },
    filter(event, player) {
        return player.storage.vl_zhan_jf >= 2 * player.hp
    },
    juexingji: true,
    forced: true,
    mark: true,
    intro: {
        content: "当前累计受到与造成了总计$点伤害",
    },
    content: async function content(event, trigger, player) {
        player.awakenSkill('vl_zhan_jf');
        await player.gainMaxHp();
        await player.recover()
        player.removeSkill('vl_zhan_sf')
        player.addSkill('vl_zhan_jn')
        player.addSkill('vl_zhan_zb')
        const result = await player.chooseTarget([1, Math.floor(game.countPlayer() / 2)], "令至多" + get.translation(Math.floor(game.countPlayer() / 2)) + "名角色获得3层「灾厄」", function (card, target, player) {
            return target != player
        }, false).set('ai', function (target) {
            return -get.attitude(_status.event.player, target) * (1 + target.countCards('j'))
        }).forResult();
        if (result.bool) {
            for (var i = 0; i < result.targets.length; i++) {
                result.targets[i].addVuff('zaie', 3)
            }
        }
    },
    derivation: ["vl_zhan_jn", "vl_zhan_zb"],
    group: "vl_zhan_jf_count",
    subSkill: {
        count: {
            charlotte: true,
            forced: true,
            trigger: {
                player: "damageBegin4",
                source: "damageBegin2",
            },
            async content(event, trigger, player) {
                player.storage.vl_zhan_jf += trigger.num
                player.updateMark('vl_zhan_jf')
            },
            sub: true,
        },
    },
    t: {
        name: "解放",
        info: `觉醒技，准备阶段，若你累计受到与造成过的伤害之和不小于你体力上限两倍，你增加1点体力上限并回复1点体力，然后失去${get.poptip("vl_zhan_sf")}并获得${get.poptip("vl_zhan_jn")}与${get.poptip("vl_zhan_zb")}，然后你可以令至多X名其他角色获得3层「灾厄」（X为场上角色数的一半并向下取整）。`,
    },
};
