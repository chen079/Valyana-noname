import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        content: "cards",
        onunmark: function (storage, player) {
						if (storage && storage.length) {
							player.$throw(storage, 1000);
							game.cardsDiscard(storage);
							game.log(storage, '被置入了弃牌堆');
							storage.length = 0;
						}
					},
    },
    enable: "phaseUse",
    usable: 1,
    init: function (player, skill) {
					if (!player.storage[skill]) player.storage[skill] = [];
				},
    filter: function (event, player) {
					return player.storage.vl_rest_qf.length < 4 && player.countCards('h') > 0;
				},
    visible: true,
    filterCard: true,
    selectCard: function () {
					var player = _status.event.player;
					return [1, 4 - player.storage.vl_rest_qf.length];
				},
    discard: false,
    toStorage: true,
    delay: false,
    content: function () {
					'step 0'
					//player.lose(cards,ui.special,'toStorage')
					player.$give(cards, player, false);
					player.storage.vl_rest_qf = player.storage.vl_rest_qf.concat(cards);
					player.markSkill('vl_rest_qf');
				},
    check: function (card) {
					return 8 - get.value(card);
				},
    onremove: function (player, skill) {
					var cards = player.storage.vl_rest_qf;
					if (cards.length) player.loseToDiscardpile(cards);
				},
    ai: {
        order: 5,
        result: {
            player: 1,
        },
    },
    group: "vl_rest_qf_1",
    subSkill: {
        "1": {
            trigger: {
                source: "damageSource",
            },
            frequent: true,
            check: function (event, player) {
							return get.attitude(player, event.player) < 0
						},
            content: function () {
							"step 0"
							player.judge()
							"step 1"
							if (result.color == 'red') {
								player.draw()
							}
							if (result.color == 'black') {
								player.discardPlayerCard(1, trigger.player, 'h', true)
							}
						},
            sub: true,
        },
    },
    t: {
        name: "阙福",
        info: "出牌阶段限一次，你可以将至多四张手牌置于你的武将上，称为“孽”（你最多拥有四枚“孽”）。当你造成伤害后，可以进行一次判定，若结果为红色，你摸一张牌； 若结果为黑色，你弃置受到伤害的角色一张手牌。",
    },
};
