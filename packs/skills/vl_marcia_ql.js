import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToTarget",
    },
    marktext: "潜",
    intro: {
        markcount: "expansion",
        content: "expansion",
        onunmark(storage, player) {
            if (storage && storage.length) {
                player.$throw(storage, 1000);
                game.cardsDiscard(storage);
                game.log(storage, '被置入了弃牌堆');
                storage.length = 0;
            }
        },
    },
    forced: true,
    init(player, storage) {
        if (!player.hasStorage('vl_marcia_ql_color')) player.setStorage('vl_marcia_ql_color', ['red', 'black'])
    },
    filter(event, player) {
        if (event.player == player) return false
        if (event.cards.length != 1 || event.targets.length != 1) return false
        let bool1 = (event.card.name == 'sha');
        let bool2 = (get.type2(event.card) == 'trick' && get.tag(event.card, 'damage'));
        if (!bool1 && !bool2) return false;
        return player.getStorage('vl_marcia_ql_color', ['red', 'black']).includes(get.color(event.cards))
    },
    logTarget: "player",
    async content(event, trigger, player) {
        player.getStorage('vl_marcia_ql_color', ['red', 'black']).remove(get.color(trigger.cards));
        await player.addToExpansion(trigger.cards, 'gain2').gaintag.add('vl_marcia_ql');
        trigger.targets.remove(player);
        trigger.getParent().triggeredTargets2.remove(player);
        trigger.untrigger();
        player.markSkill('vl_marcia_ql');
    },
    group: ["vl_marcia_ql_new", "vl_marcia_ql_gain"],
    subSkill: {
        new: {
            trigger: {
                global: "phaseBefore",
            },
            forced: true,
            unique: true,
            popup: false,
            async content(event, trigger, player) {
                player.setStorage('vl_marcia_ql_color', ['red', 'black'])
            },
            sub: true,
        },
        gain: {
            trigger: {
                player: "phaseUseBegin",
            },
            filter(event, player) {
                return player.getExpansions('vl_marcia_ql').length > 0;
            },
            forced: true,
            unique: true,
            async content(event, trigger, player) {
                let cards = player.getExpansions('vl_marcia_ql');
                if (cards.length > 0) {
                    player.gain(cards, 'gain2');
                }
            },
            sub: true,
        },
    },
    t: {
        name: "潜掠",
        info: "锁定技，每回合每种颜色限一次，当你成为其他角色使用【杀】或伤害类锦囊牌的唯一目标时，若此牌对应的实体牌数为1，你取消之，然后将此牌置于你的武将牌上，称为“潜”；出牌阶段开始时，你获得武将牌上的“潜”。",
        taici: ["先潜下去，再回来拿。", "你以为打中了，其实没有。"],
    },
};
