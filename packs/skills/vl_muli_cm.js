import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
    },
    forced: true,
    locked: false,
    filter(event, player) {
        return !game.hasPlayer(function (current) {
            return current.hasSkill("vl_muli_zc")
        });
    },
    async content(event, trigger, player) {
        player.addSkill("vl_muli_zc")
        player.storage.vl_muli_zc += 1
    },
    group: "vl_muli_cm_change",
    derivation: "vl_muli_zc",
    subSkill: {
        change: {
            trigger: {
                global: "phaseBegin",
            },
            check(event, player) {
                var att = get.attitude(player, event.player)
                return att > 0 && event.player.storage.vl_muli_zc >= event.player.hp && player.hp > 1
            },
            prompt2: "每名其他角色回合开始时，若其有【终策】，你可以弃置两张手牌然后获得【终策】与其所有策标记，然后其失去【终策】并失去1点体力。",
            filter(event, player) {
                return event.player.hasSkill('vl_muli_zc') && player.countCards('h') > 1 && event.player != player
            },
            async content(event, trigger, player) {
                const result = await player.chooseToDiscard(2, 'h', false).forResult()
                if (result.bool) {
                    var target = trigger.player
                    player.logSkill('vl_muli_cm', target)
                    player.addSkill('vl_muli_zc')
                    player.storage.vl_muli_zc += target.storage.vl_muli_zc
                    target.storage.vl_muli_zc = 0
                    target.removeSkill('vl_muli_zc')
                    target.unmarkSkill('vl_muli_zc')
                    await target.loseHp()
                } else {
                    return
                }
            },
            sub: true,
        },
    },
    t: {
        name: "绸缪",
        info: `每轮开始时，若场上没有技能${get.poptip("vl_muli_zc")}，你须获得${get.poptip("vl_muli_zc")}并获得1个“策”标记；每名角色回合开始时，若其有${get.poptip("vl_muli_zc")}，你可以弃置两张手牌然后获得${get.poptip("vl_muli_zc")}与其所有策标记，然后其失去${get.poptip("vl_muli_zc")}并失去1点体力。`,
    },
};
