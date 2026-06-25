import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    qianghua: true,
    trigger: {
        source: "damageSource",
    },
    check(event, player) {
					return event.player.next != player && event.player.previous != player
				},
    usable: 1,
    filter(event, player) {
					return event.player != player
				},
    content: async function content(event, trigger, player) {
					await trigger.player.damage(player, 'fire');
					if (player.hasSkill('_qianghua_effect')) {
						if(!trigger.player.getNext()) return;
						await trigger.player.getPrevious().damage(Math.max(1, Math.floor(trigger.num / 2)), trigger.nature);
						await trigger.player.getNext().damage(Math.max(1, Math.floor(trigger.num / 2)), trigger.nature);
					}
					player.removeSkill('_qianghua_effect');
				},
    t: {
        name: "强流",
        info: `${get.poptip("qianghua")}，每回合限一次，当你对一名其他角色造成伤害后，你可以对该角色造成1点火焰伤害。强化：你可以对其上、下家的角色各造成X点同属性伤害。（X为此次伤害值的一半并向下取整且至少为1）。`,
    },
};
