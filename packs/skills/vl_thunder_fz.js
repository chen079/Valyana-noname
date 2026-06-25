import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
        source: "damageSource",
    },
    frequent: true,
    content: function () {
					'step 0'
					event.num = trigger.num
					'step 1'
					event.cards = get.cards(2);
					player.showCards(event.cards)
					player.chooseCardButton(1, event.cards, get.prompt2('vl_thunder_fz'), true).set('ai', function (button) {
						get.useful(button.link);
					})
					'step 2'
					player.gain(result.links[0])
					event.cards.remove(result.links[0])
					ui.cardPile.insertBefore(event.cards[0].fix(), ui.cardPile.firstChild);
					event.num--
					"step 3"
					game.delay();
					"step 4"
					if (event.num) {
						player.chooseBool(get.prompt2('vl_thunder_fz'))
					} else event.finish();
					'step 5'
					if (result.bool) {
						player.logSkill('vl_thunder_fz');
						event.goto(1);
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
