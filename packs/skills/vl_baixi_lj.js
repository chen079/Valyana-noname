import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    forced: true,
    content: function () {
					player.storage.vl_baixi_lj = !player.storage.vl_baixi_lj
				},
    init: function (player, skill) {
					player.addSkillBlocker(skill);
					if (!player.storage.vl_baixi_lj) player.storage.vl_baixi_lj = false
				},
    onremove: function (player, skill) {
					player.removeSkillBlocker(skill);
				},
    skillBlocker: function (skill, player) {
					return skill == 'vl_baixi_lj_change' && !player.storage.vl_baixi_lj;
				},
    mod: {
        ignoredHandcard: function (card, player) {
						if (get.color(card) == 'red') {
							return true;
						}
					},
        cardDiscardable: function (card, player, name) {
						if (name == 'phaseDiscard' && get.color(card) == 'red') return false;
					},
        targetInRange: function (card, player) {
						if (get.color(card) == 'black') return true;
					},
        cardUsable: function (card, player) {
						if (get.color(card) == 'black') return Infinity;
					},
    },
    subSkill: {
        change: {
            mod: {
                suit: function (card, suit) {
								if (suit == 'spade' && get.position(card) == 'h') return 'heart';
								if (suit == 'heart' && get.position(card) == 'h') return 'spade';
								if (suit == 'club' && get.position(card) == 'h') return 'diamond';
								if (suit == 'diamond' && get.position(card) == 'h') return 'club';
							},
            },
        },
    },
    t: {
        name: "两极",
        info: "锁定技，你的红色牌不计入手牌上限，你使用黑色牌无距离与次数限制。出牌阶段，你可以将手牌中的♥/♦与♠/♣牌的花色相互交换。",
    },
};
