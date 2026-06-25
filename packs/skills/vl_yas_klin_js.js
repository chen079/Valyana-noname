import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseUseBegin",
    },
    filter(event, player) {
        return player.countCards('h') > 0
    },
    check(event, player) {
        if (player.countCards('h') < 2) return false
        if (get.attitude(player, event.player) > 0) return true
        return false;
    },
    logTarget: "player",
    preHidden: true,
    prompt2: "你可以弃置任意张不同花色的牌，然后使当前角色摸等量的牌并获得以下效果：♠：【杀】指定目标后令其本回合技能失效，♥：【杀】本回合无视防具，♣：【杀】本回合造成的伤害+1，♦：【杀】本回合无距离次数限制。",
    async content(event, trigger, player) {
        let save = false;
        if (get.attitude(player, event.player) > 0) {
            save = true;
        }
        const next = player.chooseToDiscard('h', [1, Infinity], false, function (card) {
            const suit = get.suit(card);
            for (let i = 0; i < ui.selected.cards.length; i++) {
                if (get.suit(ui.selected.cards[i]) == suit) return false;
            }
            return true;
        }).set('complexCard', true)
        next.ai = function (card) {
            if (save) {
                if (trigger.player == player) return 9 - get.value(card)
                if (ui.selected.cards.length > 2) return 0
                return 7 - get.value(card);
            }
            return 0;
        }
        const result = await next.forResult();
        const suit = [];
        let drawEvent;
        if (result.bool) {
            const cards = result.cards;
            drawEvent = trigger.player.draw(cards.length)
            if (cards && cards.length > 0) {
                for (let i = 0; i < cards.length; i++) {
                    if (!suit.includes(get.suit(cards[i]))) {
                        suit.add(get.suit(cards[i]));
                    }
                }
            }
        } else {
            return
        }
        trigger.player.addTempSkill('vl_yas_klin_js_marks')
        if (suit.includes('spade')) trigger.player.addTempSkill('vl_yas_klin_js_spade');
        if (suit.includes('heart')) trigger.player.addTempSkill('vl_yas_klin_js_heart');
        if (suit.includes('club')) trigger.player.addTempSkill('vl_yas_klin_js_club');
        if (suit.includes('diamond')) trigger.player.addTempSkill('vl_yas_klin_js_diamond');
        if (suit.length == 4) trigger.player.addTempSkill('vl_yas_klin_js_hit');
        await drawEvent;
    },
    ai: {
        result: {
            player: 1,
        },
        order: 11,
    },
    subSkill: {
        marks: {
            popup: false,
            silent: true,
            charlotte: true,
            forced: true,
            marktext: "祭",
            mark: true,
            intro: {
                content(storage, player, skill) {
                    let str = '当前状态：';
                    if (player.hasSkill('vl_yas_klin_js_spade')) str += '<br><li>♠：你的【杀】指定目标后，你令其本回合技能失效。';
                    if (player.hasSkill('vl_yas_klin_js_heart')) str += '<br><li>♥：你的【杀】无视目标防具。';
                    if (player.hasSkill('vl_yas_klin_js_club')) str += '<br><li>♣：你的【杀】造成的伤害+1。';
                    if (player.hasSkill('vl_yas_klin_js_diamond')) str += '<br><li>♦：你的【杀】无距离次数限制。';
                    if (player.hasSkill('vl_yas_klin_js_spade') && player.hasSkill('vl_yas_klin_js_heart') && player.hasSkill('vl_yas_klin_js_club') && player.hasSkill('vl_yas_klin_js_diamond')) str += '<br><li>：你的【杀】不可被响应。'
                    return str;
                },
            },
            sub: true,
        },
        spade: {
            shaRelated: true,
            popup: false,
            silent: true,
            charlotte: true,
            forced: true,
            init(player) {
                player.markSkill('vl_yas_klin_js');
            },
            onremove(player) {
                player.unmarkSkill('vl_yas_klin_js');
            },
            trigger: {
                player: "useCardToTargeted",
            },
            filter(event, player) {
                return event.card.name == 'sha';
            },
            logTarget: "target",
            async content(event, trigger, player) {
                trigger.target.addTempSkill('baiban');
            },
            ai: {
                ignoreSkill: true,
                skillTagFilter(player, tag, arg) {
                    if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
                    if (!arg.skill || !lib.skill[arg.skill] || lib.skill[arg.skill].charlotte || !arg.target.getSkills(true, false).includes(arg.skill)) return false;
                },
            },
            sub: true,
        },
        heart: {
            shaRelated: true,
            popup: false,
            silent: true,
            charlotte: true,
            init(player) {
                player.markSkill('vl_yas_klin_js');
            },
            onremove(player) {
                player.unmarkSkill('vl_yas_klin_js');
            },
            trigger: {
                player: "useCardToTargeted",
            },
            forced: true,
            filter(event, player) {
                return event.card.name == 'sha';
            },
            logTarget: "target",
            async content(event, trigger, player) {
                trigger.target.addTempSkill('qinggang2');
                trigger.target.storage.qinggang2.add(trigger.card);
            },
            ai: {
                skillTagFilter(player, tag, arg) {
                    if (!arg || arg.isLink || !arg.card || arg.card.name != 'sha') return false;
                    if (arg && arg.name == 'sha') return true;
                },
                unequip_ai: true,
            },
            sub: true,
        },
        hit: {
            trigger: {
                player: "useCardToPlayered",
            },
            forced: true,
            filter(event, player) {
                return event.card.name == 'sha';
            },
            logTarget: "target",
            async content(event, trigger, player) {
                trigger.getParent().directHit.add(trigger.target);
            },
            ai: {
                directHit_ai: true,
                skillTagFilter(player, tag, arg) {
                    if (arg.card.name != 'sha') return false;
                },
            },
        },
        club: {
            trigger: {
                source: "damageBegin2",
            },
            filter(event, player) {
                return event.card && event.card.name == 'sha';
            },
            forced: true,
            popup: false,
            silent: true,
            charlotte: true,
            init(player) {
                player.markSkill('vl_yas_klin_js');
            },
            onremove(player) {
                player.unmarkSkill('vl_yas_klin_js');
            },
            async content(event, trigger, player) {
                trigger.num++;
            },
            sub: true,
        },
        diamond: {
            popup: false,
            silent: true,
            charlotte: true,
            init(player) {
                player.markSkill('vl_yas_klin_js');
            },
            onremove(player) {
                player.unmarkSkill('vl_yas_klin_js');
            },
            mod: {
                targetInRange(card, player, target, now) {
                    if (card.name == 'sha') return true;
                },
                cardUsable(card, player, num) {
                    if (card.name == 'sha') return Infinity
                },
            },
            sub: true,
            forced: true,
        },
    },
    t: {
        name: "祭牲",
        info: "每名角色出牌阶段开始时，你可以弃置任意张不同花色的手牌并令当前回合角色摸等量的牌，然后根据你弃置的花色，该角色获得以下效果直到回合结束：<li>♠：【杀】指定目标后令其本回合技能失效，<li>♥：【杀】本回合无视防具，<li>♣：【杀】本回合造成的伤害+1，<li>♦：【杀】本回合无距离次数限制；</li>若你因此弃置了四种不同的花色，你令该角色额外获得以下效果：<li>你的【杀】不可被响应。",
    },
};
