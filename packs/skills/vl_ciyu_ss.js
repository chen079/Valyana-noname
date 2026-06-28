import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    async content(event, trigger, player) {
        const { cards = [] } = await player.draw(2).forResult();
        let remainingCards = cards.slice();
        while (remainingCards.length) {
            const result = await player.chooseCardTarget({
                filterCard(card) {
                    return (_status.event.cards || []).includes(card);
                },
                selectCard: [1, remainingCards.length],
                filterTarget(card, player, target) {
                    return player != target;
                },
                ai1(card) {
                    if (ui.selected.cards.length > 0) return -1;
                    if (card.name == 'du') return 20;
                    return _status.event.player.countCards('h') - _status.event.player.hp;
                },
                ai2(target) {
                    const att = get.attitude(_status.event.player, target);
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                        return 1 - att;
                    }
                    return att - 4;
                },
                prompt: '回合开始时，你摸' + get.translation(remainingCards.length) + '张牌然后分配给任意名角色，并将这些牌置于其武将牌上称为“协”',
            }).set('cards', remainingCards).forResult();
            if (!result.bool) {
                player.addTempSkill("vl_xieji", { player: "phaseEnd" });
                player.addToExpansion(remainingCards, 'gain2').gaintag.add('vl_xieji');
                return;
            }
            const target = result.targets[0];
            player.line(result.targets, 'green');
            target.addTempSkill("vl_xieji", { player: "phaseEnd" });
            target.addToExpansion(result.cards, 'gain2').gaintag.add('vl_xieji');
            for (const card of result.cards) {
                remainingCards.remove(card);
            }
        }
    },
    group: "vl_ciyu_ss_sha",
    subSkill: {
        sha: {
            trigger: {
                global: "useCard2",
            },
            filter(event, player) {
                if (!(event.card.name == 'sha' || get.type(event.card, null, false) == 'trick')) return false;
                if (event.player.getExpansions('vl_xieji').length == 0) return false
                return true;
            },
            direct: true,
            async content(event, trigger, player) {
                const info = get.info(trigger.card);
                const canAdd = trigger.targets && !info.multitarget && game.filterPlayer().some(function (current) {
                    return lib.filter.targetEnabled2(trigger.card, trigger.player, current) && !trigger.targets.includes(current);
                });
                if (canAdd) {
                    const addResult = await player.chooseTarget(get.prompt('vl_ciyu_ss'), '素术：是否增加一名' + get.translation(trigger.card) + '的目标？', function (card, player, target) {
                        const source = _status.event.source;
                        return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, source, target);
                    }).set('ai', function (target) {
                        const trigger = _status.event.getTrigger();
                        const source = _status.event.source;
                        return get.effect(target, trigger.card, source, _status.event.player);
                    }).set('targets', trigger.targets).set('card', trigger.card).set('source', trigger.player).forResult();
                    if (!addResult.bool) return;
                    if (!event.isMine() && !event.isOnline()) game.delayx();
                    const target = addResult.targets[0];
                    const discardResult = await player.chooseCardButton('选择弃置一张“协”', trigger.player.getExpansions('vl_xieji'), true).forResult();
                    if (!discardResult.bool) return;
                    trigger.player.loseToDiscardpile(discardResult.links);
                    player.logSkill('vl_ciyu_ss', target);
                    trigger.targets.add(target);
                    return;
                }
                if (!info.multitarget && trigger.targets && trigger.targets.length > 1) {
                    const reduceResult = await player.chooseTarget(get.prompt('vl_ciyu_ss'), '素术：是否减少一名' + get.translation(trigger.card) + '的目标？', function (card, player, target) {
                        const source = _status.event.getTrigger().player;
                        return _status.event.getTrigger().targets.includes(target);
                    }).set('ai', function (target) {
                        const trigger = _status.event.getTrigger();
                        const source = _status.event.source;
                        return -get.effect(target, trigger.card, source, _status.event.player);
                    }).set('targets', trigger.targets).set('card', trigger.card).set('source', trigger.player).setHiddenSkill(event.name).forResult();
                    if (!reduceResult.bool) return;
                    const targets = reduceResult.targets.slice();
                    for (const target of targets) {
                        trigger.targets.remove(target);
                    }
                    const discardResult = await player.chooseCardButton('选择弃置一张“协”', trigger.player.getExpansions('vl_xieji'), true).forResult();
                    if (!discardResult.bool) return;
                    player.logSkill('vl_ciyu_ss', targets);
                    trigger.player.loseToDiscardpile(discardResult.links);
                }
            },
            sub: true,
        },
    },
    t: {
        name: "素术",
        info: "回合开始时，你摸两张牌然后任意分配给任意角色，并置于其武将牌上称为“协”；当一名角色使用【杀】或普通锦囊牌指定目标后，若其有“协”，你可以弃置其一张“协”为此牌增加或减少一个目标（无距离限制且至少有一个目标）；结束阶段，其获得其武将牌上的所有“协”。",
        taici: ["协先落定，局才算开。", "增一减一，都在我手中。"],
    },
};
