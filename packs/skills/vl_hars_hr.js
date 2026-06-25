import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    global: "vl_hars_hr_gola",
    trigger: {
        target: "useCardToTargeted",
    },
    check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
    filter: function (event, player) {
					return (event.card.name == 'sha' || (get.type(event.card) == 'trick' && get.tag(event.card, 'damage'))) && event.player != player;
				},
    frequent: true,
    logTarget: "player",
    content: function () {
					'step 0'
					trigger.player.chooseBool('是否令此牌对' + get.translation(player) + '无效，并令其摸两张牌')
						.set('ai', function () {
							var player = _status.event.player
							var target = _status.event.target
							return get.attitude(player, target) > 0 && get.effect(target, trigger.card, player, target) < 0
						}).set('target', player)
					'step 1'
					if (result.bool) {
						trigger.excluded.add(player);
						player.draw(2)
					}
				},
    subSkill: {
        gola: {
            enable: "phaseUse",
            filter: function (event, player) {
							return game.hasPlayer(function (current) {
								return current != player && current.hasSkill('vl_hars_hr');
							});
						},
            filterTarget: function (card, player, target) {
							return player != target && target.hasSkill('vl_hars_hr');
						},
            lose: false,
            discard: false,
            delay: false,
            check: function (card) {
							return 8 - get.value(card)
						},
            filterCard: true,
            selectCard: [1, 2],
            usable: 1,
            prompt: "出牌阶段限一次，你可以交给拥有技能【浩然】的角色至多两张牌。",
            content: function () {
							target.gain(cards, player, 'giveAuto')
						},
            ai: {
                order: 10,
                expose: 0.2,
                result: {
                    player: function (player, target) {
									var target = game.findPlayer(function (current) {
										return current.hasSkill('bolan');
									});
									if (target) {
										return get.attitude(player, target);
									}
								},
                },
            },
        },
    },
    t: {
        name: "浩然",
        info: "当你成为其他角色【杀】或伤害类锦囊牌的目标后，其可以令此牌对你无效并令你摸两张牌。其他角色的出牌阶段限一次，其可以交给你至多两张牌。",
    },
};
