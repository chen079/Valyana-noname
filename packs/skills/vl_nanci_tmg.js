import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterTarget: function (card, player, target) {
					return target != player
				},
    direct: true,
    content: function () {
					'step 0'
					target.chooseToDiscard('天灭：弃置一张【闪】，否则' + get.translation(player) + '对你造成1点伤害。', function (card) {
						return get.name(card) == 'shan';
					}).set('ai', function (card) {
						return 10 - get.value(card)
					})
					'step 1'
					if (!result.bool) {
						target.damage(player, 'fire')
					}
				},
    ai: {
        order: 7,
        fireAttack: true,
        result: {
            target: function (player, target) {
							if (target.hasSkillTag('nofire')) return 0;
							if (lib.config.mode == 'versus') return -1;
							if (player.hasUnknown()) return 0;
							return get.damageEffect(target, player) - target.countCards('e');
						},
        },
    },
    t: {
        name: "天灭",
        info: "出牌阶段限一次，你可以令一名其他角色弃置一张【闪】，否则其受到你1点火焰伤害。",
    },
};
