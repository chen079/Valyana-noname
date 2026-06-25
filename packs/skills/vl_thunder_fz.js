import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
        source: "damageSource",
    },
    frequent: true,
    async content(event, trigger, player) {
        event.num = trigger.num
        while (event.num) {
        event.cards = get.cards(2);
        					player.showCards(event.cards)
        					const result = await player.chooseCardButton(1, event.cards, get.prompt2('vl_thunder_fz'), true).set('ai', function (button) {
        						get.useful(button.link);
        					}).forResult()
        const gainEvent = player.gain(result.links[0])
        					event.cards.remove(result.links[0])
        					ui.cardPile.insertBefore(event.cards[0].fix(), ui.cardPile.firstChild);
        					event.num--
        await gainEvent;
        await game.delay();
        if (event.num) {
        						const again = await player.chooseBool(get.prompt2('vl_thunder_fz')).forResult()
        						if (again.bool) {
        						player.logSkill('vl_thunder_fz');
        							continue;
        						}
        					}
        					return;
        }
    },
    ai: {
        maixie: true,
        maixie_hp: true,
    },
    t: {
        name: "奋决",
        info: "当你受到或造成1点伤害后，你可以展示牌堆顶的两张牌，然后获得其中一张并将另一张放回牌堆顶。",
    },
};
