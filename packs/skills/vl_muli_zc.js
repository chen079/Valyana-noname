import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: ["damageBegin1", "die"],
    },
    mark: true,
    init(player) {
        if (!player.hasStorage('vl_muli_zc')) player.setStorage('vl_muli_zc', 0)
    },
    intro: {
        content: "当前有$个标记",
    },
    filter(event, player) {
        if (event.name == 'damage') {
            return event.num > 0
        }
        return true
    },
    marktext: "策",
    direct: true,
    async content(event, trigger, player) {
        const target = trigger.player
        target.addSkill('vl_muli_zc')
        target.setStorage('vl_muli_zc', target.getStorage('vl_muli_zc', 0) + player.getStorage('vl_muli_zc', 0))
        player.setStorage('vl_muli_zc', 0)
        if (!player.hasSkill('vl_muli_cm')) player.loseHp()
        player.removeSkill('vl_muli_zc')
        player.unmarkSkill('vl_muli_zc')
    },
    group: ["vl_muli_zc_1", "vl_muli_zc_2"],
    subSkill: {
        "1": {
            trigger: {
                player: "phaseAfter",
            },
            forced: true,
            filter(event, player) {
                return player.hasSkill('vl_muli_zc') && player.getStorage('vl_muli_zc', 0) != 0
            },
            content: async function content(event, trigger, player) {
                const num = player.getStorage('vl_muli_zc', 0)
                await player.loseHp(num)
                player.setStorage('vl_muli_zc', player.getStorage('vl_muli_zc', 0) + 1)
            },
            sub: true,
        },
        "2": {
            trigger: {
                player: "die",
            },
            forceDie: true,
            locked: true,
            direct: true,
            async content(event, trigger, player) {
                const result = await player.chooseTarget(`请选择${get.poptip("vl_muli_zc")}的目标`, `选择一名其他角色，令其获得技能${get.poptip("vl_muli_zc")}`, true, lib.filter.notMe).set('forceDie', true).set('ai', function (target) {
                    return -get.attitude(_status.event.player, target);
                }).forResult();
                if (result.bool) {
                    const target = result.targets[0]
                    player.logSkill('vl_muli_zc', target)
                    target.addSkill('vl_muli_zc')
                    target.setStorage('vl_muli_zc', target.getStorage('vl_muli_zc', 0) + player.getStorage('vl_muli_zc', 0))
                    player.setStorage('vl_muli_zc', 0)
                    player.removeSkill('vl_muli_zc')
                    player.unmarkSkill('vl_muli_zc')
                }
            },
            sub: true,
        },
    },
    t: {
        name: "终策",
        info: `锁定技，你对其他角色造成伤害时，令其获得技能${get.poptip("vl_muli_zc")}与你的所有“策”并失去技能${get.poptip("vl_muli_zc")}(若你没有${get.poptip("vl_muli_cm")}，你先失去1点体力)。结束阶段，若你拥有“策”，你失去X点体力（X为“策”的数量），然后“策”的数量+1；当你死亡后，你令一名其他角色获得${get.poptip("vl_muli_zc")}与你的所有“策”。`,
    },
};
