import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mark: true,
    locked: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
        content(storage, player, skill) {
            if (player.getStorage('vl_krikt_th', false) == true) return '锁定技，出牌阶段，你的【杀】无使用次数限制，你的黑色【杀】均视为雷【杀】；每当你对其他角色造成1点伤害，你弃置其一张手牌。';
            return '锁定技，你的【杀】可以额外指定一个目标，你的红色【杀】均视为火【杀】；每当你对其他角色造成1点伤害，你摸一张牌。';
        },
    },
    trigger: {
        player: "phaseUseBegin",
    },
    forced: true,
    async content(event, trigger, player) {
        if (player.getStorage('vl_krikt_th', false) == true) {
            player.setStorage('vl_krikt_th', false);
            player.addTempSkill('vl_krikt_th_2', 'phaseUseAfter');
        }
        else {
            player.setStorage('vl_krikt_th', true);
            player.addTempSkill('vl_krikt_th_1', 'phaseUseAfter');
        };
        player.updateMark('vl_krikt_th')
    },
    subSkill: {
        "1": {
            trigger: {
                source: "damageSource",
            },
            filter(event, player) {
                return player != event.player
            },
            async content(event, trigger, player) {
                await player.discardPlayerCard(trigger.num, trigger.player, 'h', true)
            },
            forced: true,
            mod: {
                cardUsable(card) {
                    if (card.name == 'sha') return Infinity;
                },
                cardnature(card, player) {
                    if (card.name == 'sha' && get.color(card) == 'black') return 'thunder';
                },
            },
            ai: {
                effect: {
                    target(card, player, target, current) {
                        if (get.tag(card, 'respondSha') && current < 0) return 0.6
                    },
                },
                respondSha: true,
            },
            sub: true,
        },
        "2": {
            trigger: {
                source: "damageSource",
            },
            filter(event, player) {
                return player != event.player
            },
            async content(event, trigger, player) {
                await player.draw(trigger.num)
            },
            forced: true,
            mod: {
                targetInRange(card, player) {
                    if (card.name == 'sha') return true;
                },
                cardnature(card, player) {
                    if (card.name == 'sha' && get.color(card) == 'red') return 'fire';
                },
                selectTarget(card, player, range) {
                    if (card.name == 'sha' && range[1] != -1) {
                        range[1]++;
                    }
                },
            },
            ai: {
                effect: {
                    target(card, player, target, current) {
                        if (get.tag(card, 'respondSha') && current < 0) return 0.6
                    },
                },
                respondSha: true,
            },
            sub: true,
        },
    },
    ai: {
        fireAttack: true,
        halfneg: true,
        threaten: 1.05,
    },
    t: {
        name: "调和",
        info: "转换技，锁定技，阴：出牌阶段，你的【杀】无使用次数限制，你的黑色【杀】均视为雷【杀】；每当你对其他角色造成1点伤害，你弃置其一张手牌。阳：出牌阶段，你的【杀】无距离限制且可以额外指定一个目标，你的红色【杀】均视为火【杀】；每当你对其他角色造成1点伤害，你摸一张牌。",
    },
};
