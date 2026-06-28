import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    t: {
        name: '狂乱',
        info: '出牌阶段限一次，你可以弃置一张牌，然后令一名其他角色选择一项：<br>1. 令你摸两张牌，且本回合你对其使用【杀】无距离和次数限制；<br>2. 交给你一张牌，然后其本回合不能使用或打出【闪】。',
    
        taici: ['王座之下，万物皆可狂乱。', '秩序太乏味了，让混沌起舞吧。'],
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
                if (choiceList.length === 1) return 0;
                const targetHasShan = target.countCards('hs', 'shan') > 0;
                const targetHasTaoJiu = target.countCards('hs', 'tao|jiu') > 0;
                const targetHp = target.hp;
                const targetTotalCards = target.countCards('he');
                const playerHasSha = player.countCards('hs', 'sha') > 0;
                const att = get.attitude(target, player);
                if (att > 0) {
                    return 0;
                }
                if (!playerHasSha) {
                    return 1;
                }
                if (targetHasShan) {
                    return 0;
                }
                if (targetHasTaoJiu && targetHp <= 2) {
                    return 0;
                }
                const hasTrash = targetTotalCards - target.countCards('hs', 'shan|tao|jiu') > 0;
                if (hasTrash) {
                    return 1;
                }
                if (targetHp > 3) {
                    return 1;
                }
                return 1;
            })
            .set('prompt', get.prompt2('vl_kuangluan'))
        if (result.index == 0) {
            await player.draw(2)
            player.setStorage('vl_kuangluan_unlimitSha', [target])
            player.addTempSkill('vl_kuangsha_unlimitSha')
        } else {
            await target.chooseToGive(true, "he", player).set("prompt", '义父：交给' + get.translation(player) + '一张牌，然后你本回合不能使用或打出【闪】')
            target.addTempSkill('vl_kuangluan_noShan')
        }
    },
    init(player) {
        if (!player.hasStorage('vl_kuangluan_unlimitSha')) {
            player.setStorage('vl_kuangluan_unlimitSha', []);
        }
    },
    ai: {
        order: 14,
        result: {
            result: {
                // 评估对目标角色的收益（负值表示负面效果，目标越不喜欢越负）
                target(player, target) {
                    // 选项1损失：目标让玩家摸2张牌 + 杀无限制
                    let loss1 = 2; // 摸2牌的基本价值
                    const shaCount = player.getCards('sha').length;
                    if (shaCount > 0) loss1 += 1; // 若有杀，则杀限制取消有额外威胁

                    // 选项2损失：目标交给玩家1张牌 + 本回合不能使用/打出【闪】
                    let loss2 = 1; // 失去1张牌
                    if (target.getCards('shan').length > 0) loss2 += 1; // 有闪则损失更大
                    if (target.hp <= 2) loss2 += 1; // 残血时不能闪可能致命

                    // 目标会理性选择损失较小的选项，因此实际损失取 min
                    const actualLoss = Math.min(loss1, loss2);
                    return -actualLoss; // 返回负值
                },

                // 评估对玩家自身（发动者）的收益（正值表示收益）
                player(player, target) {
                    // 计算两个选项对玩家的收益（未扣弃牌成本）
                    let gain1 = 2; // 摸2牌
                    const shaCount = player.getCards('sha').length;
                    if (shaCount > 0) gain1 += 1; // 杀加成收益

                    let gain2 = 1; // 获得目标1张牌
                    if (target.getCards('shan').length > 0) gain2 += 1; // 目标不能闪，杀必中收益

                    // 预测目标会选哪个选项（与 target 函数中的判断保持一致）
                    const loss1 = 2 + (shaCount > 0 ? 1 : 0);
                    const loss2 = 1 + (target.getCards('shan').length > 0 ? 1 : 0) + (target.hp <= 2 ? 1 : 0);
                    const targetChoice = (loss1 < loss2) ? 1 : 2; // 目标选损失小的

                    // 玩家实际获得收益（对应目标选择的选项）
                    const playerGain = (targetChoice === 1) ? gain1 : gain2;

                    // 扣除发动技能必须弃置的1张牌成本
                    return playerGain - 1;
                }
            }
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
