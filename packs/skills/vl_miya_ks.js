import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    forced: true,
    filter: function (event, player) {
					return event.card && event.card.name == 'sha' && _status.currentPhase == player;
				},
    content: function () {
					player.getStat().card.sha--;
				},
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						var num = player.getHistory('useCard', function (evt1) {
							return player.getHistory('sourceDamage', function (evt2) {
								return evt1 && evt2 && evt1.card && evt1.card.name == 'sha' && evt1.card == evt2.card
							}).length > 0
						}).length;
						dialog.addText('本回合你使用过造成伤害的【杀】的数量为：' + num)
					},
    },
    mod: {
        cardUsable: function (card, player, num) {
						if (card.name == 'sha') return num + 1;
					},
    },
    group: "vl_miya_ks_draw",
    subSkill: {
        draw: {
            trigger: {
                global: "phaseEnd",
            },
            frequent: true,
            content: function () {
							'step 0'
							event.num = player.getHistory('useCard', function (evt1) {
								return player.getHistory('sourceDamage', function (evt2) {
									return evt1 && evt2 && evt1.card && evt1.card.name == 'sha' && evt1.card == evt2.card
								}).length > 0
							}).length;
							'step 1'
							player.draw(2 * event.num)
						},
        },
    },
    t: {
        name: "狂嗜",
        info: "锁定技，出牌阶段，你可以额外使用一张【杀】；当你的【杀】造成伤害后，你本回合出【杀】次数+1；每回合结束时，你可以摸2X张牌（X为本回合你使用过造成伤害的【杀】的数量）。",
    },
};
