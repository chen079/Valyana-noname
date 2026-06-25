import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    limited: true,
    enable: "phaseUse",
    animationColor: "thunder",
    skillAnimation: "epic",
    filter: function (event, player) {
					return !player.storage.vl_mika_pl && game.players.length >= 3
				},
    init: function (player) {
					player.storage.vl_mika_pl = false;
				},
    filterTarget: function (card, player, target) {
					if (target == player) return false;
					return true;
				},
    filterCard: true,
    selectCard: -1,
    mark: true,
    discard: false,
    lose: false,
    delay: false,
    selectTarget: 2,
    multitarget: true,
    content: function () {
					'step 0'
					player.awakenSkill('vl_mika_pl');
					player.storage.vl_mika_pl = true;
					targets[0].gain(cards, player, 'give');
					'step 1'
					event.list = targets[0].getCards('h')
					'step 2'
					var card = event.list.shift()
					if (targets[1] && targets[1].isIn() && targets[0].canUse(card, targets[1], false)) {
						targets[0].useCard(card, targets[1], false)
					}
					else {
						player.gain(card)
					}
					if (event.list.length) {
						event.redo()
					} else {
						event.finish()
					}
				},
    intro: {
        content: "limited",
    },
    ai: {
        expose: 0.4,
        order: 4,
        result: {
            target: function (player, target) {
							if (player.hasUnknown()) return 0;
							if (ui.selected.targets.length) return -1;
							return -0.5;
						},
        },
    },
    t: {
        name: "破浪",
        info: "限定技，出牌阶段，你可以将你的所有手牌交给一名其他角色，然后对你指定的另一名其他角色随机使用当前的所有手牌（无距离限制），你获得无法使用的牌。",
    },
};
