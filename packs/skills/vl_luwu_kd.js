import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseZhunbeiBegin",
    },
    filter: function (event, player) {
					return !event.player.isLinked()
				},
    content: async function content(event, trigger, player) {
					await trigger.player.link();
					await player.draw(2);
					player.addTempSkill("vl_luwu_kd_1");
				},
    subSkill: {
        "1": {
            trigger: {
                global: "phaseJieshuBegin",
            },
            direct: true,
            filter: function (event, player) {
							return game.filterPlayer(current => current.isLinked() && current != player).length > 0 && player.getHistory('damage').length
						},
            content: function () {
							'step 0'
							event.players = game.filterPlayer(current => current.isLinked() && current != player).sortBySeat()
							'step 1'
							event.player = event.players.shift()
							event.player.discardPlayerCard(player, 1, 'he', true)
							if (event.players.length) event.redo()
						},
        },
    },
    t: {
        name: "困斗",
        info: "一名角色的准备阶段，若其未横置，则你可以横置其并摸两张牌，本回合的结束阶段，若你此回合受到过伤害，其他横置角色依次弃置你一张牌。",
    },
};
