import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "useCardToPlayer",
    },
    filter: function (event, player) {
					if (!player.countCards('h')) return false;
					return event.player != player && event.card.name == 'sha' && !event.targets.includes(player) && event.player.inRange(player)
				},
    direct: true,
    content: function () {
					"step 0"
					var effect = 0;
					for (var i = 0; i < trigger.targets.length; i++) {
						effect -= get.effect(trigger.targets[i], trigger.card, trigger.player, player);
					}
					if (effect > 0) {
						if (get.color(trigger.card) != 'black') {
							effect = 0;
						}
						else {
							effect = 1;
						}
						if (trigger.targets.length == 1) {
							if (trigger.targets[0].hp == 1) {
								effect++;
							}
							if (effect > 0 && trigger.targets[0].countCards('h') < player.countCards('h')) {
								effect++;
							}
						}
						if (effect > 0) {
							effect += 6;
						}
					}
					player.chooseCard('h', get.prompt2('vl_mierk_jc', trigger.player)).set('ai', function (card) {
						if (get.attitude(player, trigger.player) > 0) return 0
						if (_status.event.effect >= 0) {
							var val = get.value(card);
							if (val < 0) return 10 - val;
							return _status.event.effect - val;
						}
						return 0;
					}).set('effect', effect).set('logSkill', ['vl_mierk_jc', trigger.player]);
					"step 1"
					if (result.bool && result.cards) {
						event.card = result.cards[0];
						trigger.targets.length = 0;
						trigger.getParent().triggeredTargets1.length = 0;
					}
					else {
						event.finish();
					}
					"step 2"
					if (!event.isMine()) game.delayx();
					"step 3"
					if (event.card) {
						player.logSkill('vl_mierk_jc', trigger.player);
						player.lose(event.card, ui.cardPile, 'visible', 'insert');
						player.$throw(event.card, 1000);
						game.log(player, '将', card, '置于牌堆顶');
					}
					"step 4"
					trigger.player.addVuff('shisheng')
					trigger.player.addVuff('zhenhan', player)
					trigger.getParent().targets.push(player);
					trigger.player.line(player);
					game.delay();
				},
    ai: {
        threaten: 1.1,
        expose: 0.25,
    },
    _priority: 0,
    t: {
        name: "讥刺",
        info: "当一名其他角色使用【杀】指定目标时，若你在其的攻击范围内且你不是目标，则你可以将一张手牌置于牌堆顶，取消所有目标，然后你成为目标并令使用者获得1层「失声」和1层「震撼」。",
    },
};
