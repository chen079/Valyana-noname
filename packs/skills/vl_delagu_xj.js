import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 2,
    filter: function (event, player) {
					return !player.hasSkill('vl_delagu_xj_blocker')
				},
    content: async function content(event, trigger, player) {
					await player.loseHp()
					player.addVuff('kangfen')
				},
    group: "vl_delagu_xj_die",
    subSkill: {
        blocker: {},
        die: {
            trigger: {
                player: "dying",
            },
            direct: true,
            popup: false,
            filter: function (event, player) {
							return event.reason && event.reason.getParent().name == 'vl_delagu_xj';
						},
            content: async function content(event, trigger, player) {
							await player.recover();
							game.players.slice(0).remove(player).forEach(i => i.addVuff('chuxue'))
							player.addTempSkill('vl_delagu_xj_blocker');
						},
            _priority: 0,
        },
    },
    ai: {
        order: 4,
        player: function (player, target) {
						if (player.hp == 3) return -1
						return 1
					},
    },
    t: {
        name: "血祭",
        info: "出牌阶段限两次，你可以失去1点体力并获得1层「亢奋」。你因此进入濒死状态时回复1点体力，所有其他角色获得1层“流血”且本回合不可再发动。",
    },
};
