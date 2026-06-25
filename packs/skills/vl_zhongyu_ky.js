import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return (player.getDamagedHp() + 1) > 0 && player.countCards('h') > 0;
				},
    filterTarget: function (card, player, target) {
					return player != target
				},
    selectTarget: function () {
					return ui.selected.cards.length;
				},
    selectCard: function () {
					var player = _status.currentPhase;
					return [1, Math.min(game.players.length - 1, player.getDamagedHp() + 1)];
				},
    filterCard: true,
    position: "he",
    check: function (card) {
					if (ui.selected.cards.length == 0) {
						return 8 - get.value(card);
					}
					return 6 - get.value(card);
				},
    content: function () {
					"step 0"
					target.damage('frmad');
				},
    ai: {
        order: 9,
        result: {
            target: function (player, target) {
							return get.damageEffect(target, player, target);
						},
        },
        threaten: function (player, target) {
						if (target.hp == 1) return 2;
						if (target.hp == 2) return 1.5;
						return 0.5;
					},
        maixie: true,
        effect: {
            target: function (card, player, target) {
							if (get.tag(card, 'damage')) {
								if (target.hp == target.maxHp) return [0, 1];
							}
							if (get.tag(card, 'recover') && player.hp >= player.maxHp - 1) return [0, 0];
						},
        },
    },
    group: "vl_zhongyu_ky_add",
    subSkill: {
        add: {
            trigger: {
                source: "damageBegin1",
            },
            frequent: true,
            filter: function (event, player) {
							return !event.nature && event.player != player
						},
            content: function () {
							game.setNature(trigger, 'frmad');
						},
        },
    },
    t: {
        name: "狂焰",
        info: "出牌阶段限一次，你可以弃置至多X+1张牌并对等量的角色造成1点「疯狂」伤害（X为你的已损体力值）。当你对其他角色造成非属性伤害时，你可以将此伤害改为狂属性。",
    },
};
