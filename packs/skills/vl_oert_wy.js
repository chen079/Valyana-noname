import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    firstDo: true,
    logTarget: function (event, player) {
					return game.filterPlayer(function (current) {
						return current.isAlive();
					});
				},
    forced: true,
    content: function () {
					'step 0'
					game.countPlayer(function (current) {
						if (current != player) {
							current.addTempSkill('baiban')
						}
					})
				},
    group: ["vl_oert_wy_nouse"],
    subSkill: {
        nouse: {
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            logTarget: function (event, player) {
							return game.filterPlayer(function (current) {
								return current.isAlive();
							});
						},
            lastDo: true,
            forced: true,
            content: function () {
							'step 0'
							var list = game.filterPlayer(function (current) {
								return current.isAlive();
							}).sortBySeat();
							list.remove(player)
							event.list = list;
							'step 1'
							if (event.list.length) {
								event.list.shift().addTempSkill("qinggang2");
								event.redo();
							}
						},
            sub: true,
        },
    },
    t: {
        name: "威压",
        info: "锁定技，回合开始时，所有其他角色武将牌上的技能与防具无效直到回合结束。（特殊技能除外）",
    },
};
