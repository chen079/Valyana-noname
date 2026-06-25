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
    init(player) {
					player.storage.vl_sisk_jx = false;
				},
    async content(event, trigger, player) {
        const target = event.target;
        player.awakenSkill("vl_sisk_jx")
        const num = player.maxHp - player.hp - 1
        await player.loseMaxHp(num)
        await player.recover(num)
        					await player.draw(num)
        await target.damage(num, player)
    },
    ai: {
        order: 2,
        result: {
            target: (target, player) => {
							const num = Math.min(Math.max(0, player.getDamagedHp() - 1), 0)
							return -2 * num - 0.1
						},
            player(target, player) {
							const num = player.maxHp - player.hp - 1
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
