import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBegin",
    },
    direct: true,
    content: () => {
        let num = 1 - player.countVuffNum('mianyi')
        if (num != 0) player.changeVuff('mianyi', num)
    },
    group: ["vl_mokalin_dh_reduceto", "vl_mokalin_dh_lose"],
    subSkill: {
        reduceto: {
            trigger: {
                player: "reduceVuffEnd",
            },
            filter: (event, player) => {
                return event.buff == 'mianyi' && player.countVuffNum('mianyi') == 0 && event.num > 0 && player.countCards('h') > 0 && player.hp > 0
            },
            direct: true,
            async content(event, trigger, player) {
                const num = Math.min(player.countCards('h'), player.hp);
                const discard = await player.chooseToDiscard('h', num, true).forResult();
                const cards = discard.cards;
                const targetResult = await player.chooseTarget('令任意名角色获得你弃置的牌中的一张', [1, cards.length]).set('ai', function (target) {
                    return get.attitude(player, target)
                }).forResult();
                if (!targetResult.bool) return;
                const targets = targetResult.targets.sortBySeat(player);
                for (const target of targets) {
                    if (!cards.length) return;
                    const choose = await target.chooseCardButton(cards, '获得其中一张牌').set('ai', function (button) {
                        return get.value(button.link, _status.event.player);
                    }).forResult();
                    if (choose.bool) {
                        await target.gain(choose.links, 'gain2');
                        cards.removeArray(choose.links);
                    }
                }
            },
        },
        lose: {
            trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
            },
            prompt: "是否发动【地护】？",
            prompt2: "减少1层「免疫」并摸X张牌（X为你的体力值）。",
            usable: 1,
            filter(event, player) {
                let evt = event.getl(player);
                return evt && evt.cards2 && evt.cards2.length > 0 && player.hp > 0
            },
            content: async function content(event, trigger, player) {
                const num = player.getHp();
                await player.draw(num);
                await player.reduceVuff('mianyi');
            },
        },
    },
    t: {
        name: "地护",
        info: "每个回合开始时，你的「免疫」调整至1层；你的「免疫」消解后，弃置X张手牌，不足则全弃，然后可以令任意名角色获得其中一张；每回合限一次，你失去牌后，可以摸X张牌，令「免疫」层数–1（X为你的体力值）。",
    },
};
