import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "dying",
    },
    direct: true,
    filter: function (event, player) {
					if (event.player == player) return false
					return player.countCards('h') > 0 && event.player.countCards('h') > 0 && !player.hasSkill('vl_sangdi_bf_blocker')
				},
    content: function () {
					"step 0"
					trigger.player.chooseBool('是否令' + get.translation(player) + '观看你的手牌，然后其就可以与你交换一张牌。')
						.set('ai', function () {
							var player = _status.event.player
							var target = _status.event.target
							if (get.attitude(player, target) > 0) return true
							return false
						}).set('target', player)
					'step 1'
					if (result.bool) {
						player.chooseCardButton(get.prompt('vl_sangdi_bf'), trigger.player.getCards('h')).ai = function (button) {
							return get.value(button.link) - 5;
						}
					} else {
						event.finish()
					}
					"step 2"
					if (result.bool) {
						event.card = result.links[0];
						player.chooseCard('h', true, '用一张手牌替换' + get.translation(event.card)).ai = function (card) {
							return -get.value(card);
						};
					} else {
						event.finish();
					}
					"step 3"
					if (result.bool) {
						trigger.player.give(event.card, player, false);
						player.give(result.cards, trigger.player, false);
						game.log(player, '与', trigger.player, '交换了一张手牌');
						player.addTempSkill('vl_sangdi_bf_blocker')
					}
				},
    subSkill: {
        blocker: {},
    },
    ai: {
        order: 2,
        threaten: 1.5,
        result: {
            player: 1,
        },
    },
    _priority: 0,
    t: {
        name: "捕风",
        info: "每回合限一次，一名有手牌的其他角色进入濒死阶段时，其可以令你观看其手牌，然后可以用一张手牌交换其中一张。",
    },
};
