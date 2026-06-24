import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    t: {
        name: '狂乱',
        info: '出牌阶段限一次，你可以弃置一张牌，然后令一名其他角色选择一项：<br>1. 令你摸两张牌，且本回合你对其使用【杀】无距离和次数限制；<br>2. 交给你一张牌，然后其本回合不能使用或打出【闪】。'
    },
    enable: "phaseUse",
    selectTarget: 1,
    usable: 1,
    filter(event, player) {
        return player.countCards("he") > 0;
    },
    filterTarget(card, player, target) {
        return player != target
    },
    discard: true,
    position: "he",
    check(card) {
        return 8 - get.value(card);
    },
    async content(event, trigger, player) {
        const target = event.target
        const choiceList = ['令' + get.translation(player) + '摸两张牌，且本回合' + get.translation(player) + '对你使用【杀】无距离和次数限制。']
        if (target.countCards('he') > 0) choiceList.push('交给' + get.translation(player) + '一张牌，然后你本回合不能使用或打出【闪】')
        const result = await target.chooseControl(true)
            .set('choiceList', choiceList)
            .set('ai', () => {
                if (choiceList.length > 1) {
                    if (target.countCards('hs', 'shan') > 0) return 1
                    let att = get.attitude(target, player)
                    if (att > 0) return 0
                    return 1
                } else return 0
            })
            .set('prompt', get.prompt2('vl_kuangluan'))
        if (result.index == 0) {
            await player.draw(2)
            player.storage.vl_kuangluan_unlimitSha[0] = target
            player.addTempSkill('vl_kuangsha_unlimitSha')
        } else {
            await target.chooseToGive(true, "he", player).set("prompt", '义父：交给' + get.translation(player) + '一张牌，然后你本回合不能使用或打出【闪】')
            target.addTempSkill('vl_kuangluan_noShan')
        }
    },
    init(player) {
        if (!player.storage.vl_kuangluan_unlimitSha) {
            player.storage.vl_kuangluan_unlimitSha = [];
        }
    },
    subSkill: {
        noShan: {
            charlotte: true,
            mark: true,
            intro: {
                content: "不能使用或打出【闪】",
            },
            mod: {
                cardEnabled2(card) {
                    if (card.name == 'shan') return false;
                },
            },
            ai: {
                threaten: 10,
            }
        },
        unlimitSha: {
            mod: {
                cardUsableTarget(card, player, target) {
                    if (card.name == "sha" && player.getStorage("vl_kuangluan_unlimitSha").includes(target)) {
                        return Infinity;
                    }
                },
                targetInRange(card, player, target) {
                    if (card.name == "sha" && player.getStorage("vl_kuangluan_unlimitSha").includes(target)) {
                        return true;
                    }
                },
            },
            charlotte: true,
            onremove: true,
            intro: {
                content: "本回合对$使用【杀】无距离和次数限制",
            },
        }
    },
}