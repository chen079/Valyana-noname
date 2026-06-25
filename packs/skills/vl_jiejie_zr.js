import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    async content(event, trigger, player) {
        const result = await player.chooseTarget(1, true).set("filterTarget", function (card, player, target) {
            return target != player
        }).set("ai", function (target) {
            var player = _status.event.player;
            return -get.attitude(player, target) / (1 + target.hp)
        }).forResult()
        var target = result.targets[0]
        target.addSkill('vl_jiejie_zr_1')
        await target.loseHp()
        target.updateMark('vl_jiejie_zr_1')
        target.storage.vl_jiejie_zr_1 += 1
        await player.gainMaxHp()
        await player.recover()
    },
    subSkill: {
        "1": {
            mark: true,
            init(player) {
                if (!player.storage.vl_jiejie_zr_1) player.storage.vl_jiejie_zr_1 = 0;
            },
            marktext: "势",
            intro: {
                content: "已拥有$个标记",
            },
            sub: true,
        },
    },
    t: {
        name: "锋开",
        info: "准备阶段，你可以选择一名其他角色，若如此做，该角色获得一个“势”标记并失去1点体力，然后你提升1点体力上限并回复1点体力。",
    },
};
