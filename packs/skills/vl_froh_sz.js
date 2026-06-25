import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    filter(event, player) {
        return !player.storage.hubian
    },
    async content(event, trigger, player) {
const result = await player.chooseTarget([1, Infinity], get.prompt2('vl_froh_sz'), function (card, player, target) {
                    return !target.isImmVuff('lingmi')
                }).set('ai', function (target) {
                    return get.attitude(player, target) > 0 && !target.hasVuff('lingmi')
                }).forResult()
if (result.bool) {
                    for (var i of result.targets) {
                        i.addVuff('lingmi')
                        i.addVuff('yujian')
                    }
                }
    },
    group: ["vl_froh_sz_draw", "vl_froh_sz_sha"],
    subSkill: {
        sha: {
            trigger: {
                source: "damageEnd",
            },
            direct: true,
            filter(event, player) {
                if (event.player == player) return false
                return player.storage.hubian
            },
            async content(event, trigger, player) {
                trigger.player.addVuff('chuxue')
                trigger.player.addVuff('jingji')
            },
        },
        draw: {
            trigger: {
                global: "reduceVuffEnd",
            },
            filter(event, player) {
                return event.buff == 'lingmi' && event.player.countVuffNum('lingmi') === 0
            },
            direct: true,
            async content(event, trigger, player) {
                await player.draw()
            },
        },
    },
    t: {
        name: "神祝",
        info: `${get.poptip("hubianji")}。<li>暗涌：回合开始时，你可以令任意名角色增加1层「灵秘」与「预见」；当一名角色的「灵秘」消解后，你摸一张牌。<li>圣咏：当你对其他角色造成伤害后，你令该角色获得1层「出血」和「荆棘」。`,
    },
};
