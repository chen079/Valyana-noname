import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    mark: true,
    skillAnimation: true,
    filter: (event, player) => player.hp < player.maxHp - 1,
    animationColor: "soil",
    limited: true,
    filterTarget: (card, player, target) => target != player,
    enable: "phaseUse",
    init: function (player) {
					player.storage.vl_sisk_jx = false;
				},
    content: () => {
					'step 0'
					player.awakenSkill("vl_sisk_jx")
					'step 1'
					event.num = player.maxHp - player.hp - 1
					'step 2'
					player.loseMaxHp(event.num)
					'step 3'
					player.recover(event.num)
					player.draw(event.num)
					'step 4'
					target.damage(event.num, player)
				},
    ai: {
        order: 2,
        result: {
            target: (target, player) => {
							var num = Math.min(Math.max(0, player.getDamagedHp() - 1), 0)
							return -2 * num - 0.1
						},
            player: function (target, player) {
							var num = player.maxHp - player.hp - 1
							if (num > 2) return 2 * num
							else return 0
						},
        },
    },
    t: {
        name: "绝袭",
        info: "限定技，出牌阶段，你可以将你的体力上限失去至体力值+1并回复X点体力，然后你对一名其他角色造成X点伤害（X为你因此减少的体力上限）。",
    },
};
