import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "drawBegin",
    },
    forced: true,
    async content(event, trigger, player) {
        trigger.bottom = true;
    },
    group: ["vl_nine_dx_wash", "vl_nine_dx_discard", "vl_nine_dx_judge"],
    subSkill: {
        judge: {
            trigger: {
                player: "judgeBegin",
            },
            forced: true,
            popup: false,
            async content(event, trigger, player) {
                event.card = get.bottomCards()[0];
                trigger.directresult = event.card
            },
        },
        wash: {
            trigger: {
                player: "phaseAfter",
            },
            popup: false,
            forced: true,
            content: async function content(event, trigger, player) {
                let cards = [].concat(Array.from(ui.discardPile.childNodes).filter(i => get.type(i) == 'equip'));
                if (cards) {
                    // for (let i = 0; i < cards.length; i++) {
                    // 	let card = cards[i]
                    // 	// ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                    // }
                    game.log(player, '将', cards, '洗入牌堆')
                }
                cards = cards.concat(get.cards(ui.cardPile.childElementCount)).randomSort();
                // for (let i = 0; i < cards.length; i++) {
                // 	ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
                // }
                await game.cardsGotoPile(cards, "triggeronly", "washCard", ["shuffleNumber", game.shuffleNumber]);
                game.updateRoundNumber();
            },
        },
        discard: {
            trigger: {
                player: "gainEnd",
            },
            forced: true,
            filter(event, player) {
                let bool = true
                for (let i = 0; i < 5; i++) {
                    if (player.hasSkill(event.getParent(i).name) && (event.getParent(i).name != 'vl_nine_dx_judge' && event.getParent(i).name != 'vl_nine_dx')) {
                        bool = false
                        break;
                    }
                }
                return _status.currentPhase != player && bool
            },
            async content(event, trigger, player) {
                await player.discard(trigger.cards)
                await player.draw()
            },
        },
        ai: {
            threaten: 1.2,
            nogain: 1,
            skillTagFilter(player) {
                return player != _status.currentPhase;
            },
        },
    },
    t: {
        name: "独行",
        info: "锁定技，①你从牌堆底摸牌、判定。②回合结束后，牌堆洗牌，洗入弃牌堆中的装备。③你弃置回合外不因此武将牌上的技能获得的牌，并摸一张牌。",
    },
};
