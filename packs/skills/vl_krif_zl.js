import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseAfter",
    },
    round: 1,
    filter: function (event, player) {
					return event.player != player;
				},
    content: async function content(event, trigger, player) {
					await player.draw()
					player.logSkill('vl_krif_zl'),
						game.broadcastAll(function (target1, target2) {
							game.swapSeat(target1, target2);
						}, player, trigger.player);
					player.insertPhase();
				},
    group: ["vl_krif_zl_roundcount"],
    t: {
        name: "追猎",
        info: "每轮限一次，一名其他角色的回合结束时，你可以摸一张牌。若如此做，你与其交换座次，然后执行一个额外的回合。",
    },
};
