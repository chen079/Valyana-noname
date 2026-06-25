import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    position: "he",
    enable: "phaseUse",
    filter(event, player) {
					var he = player.getCards('he');
					for (var i = 0; i < he.length; i++) {
						if (["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(he[i].name)) return true;
					}
					return false;
				},
    filterCard(card) {
					return ["bagua", "baiyin", "lanyinjia", "renwang", "tengjia", "zhuge"].includes(card.name);
				},
    discard: false,
    lose: false,
    delay: false,
    check() {
					return 1;
				},
    async content(event, trigger, player) {
        await player.showCards(cards);
        const card = cards[0];
        const bool = (get.position(card) == 'e');
        if (bool) player.removeEquipTrigger(card);
        game.addVideo('skill', player, ['xinfu_jingxie', [bool, get.cardInfo(card)]]);
        game.broadcastAll(function (card) {
            card.init([card.suit, card.number, 'rewrite_' + card.name]);
        }, card);
        if (bool) {
            const info = get.info(card);
            if (info.skills) {
                for (var i = 0; i < info.skills.length; i++) {
                    player.addSkillTrigger(info.skills[i]);
                }
            }
        }
    },
    ai: {
        basic: {
            order: 10,
        },
        result: {
            player: 1,
        },
    },
    t: {
        name: "精械",
        info: "出牌阶段，你可以展示一张未强化过的【诸葛连弩】或标准包/军争包/SP包中的防具牌，然后对其进行强化。",
    },
};
