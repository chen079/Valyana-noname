import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    init: function (player) {
					if (!player.storage.vl_telina_th) player.storage.vl_telina_th = 0
				},
    mark: true,
    intro: {
        content: function (storage, player, skill) { return '当前有' + storage + '个标记' },
    },
    content: function () {
					if (player.storage.vl_telina_th > 0) { player.addTempSkill("qixi", "phaseEnd") }
					if (player.storage.vl_telina_th > 1) { player.addTempSkill("duanliang", "phaseEnd") }
					if (player.storage.vl_telina_th > 2) { player.addTempSkill("guose", "phaseEnd") }
					if (player.storage.vl_telina_th > 2) { player.addTempSkill("luanji", "phaseEnd") }
				},
    group: "vl_telina_th_int",
    subSkill: {
        int: {
            forced: true,
            trigger: {
                player: "phaseAfter",
            },
            content: function () {
							player.storage.vl_telina_th = 0
							player.updateMark("vl_telina_th")
						},
            sub: true,
        },
    },
    t: {
        name: "预见",
        info: "你的回合开始时，根据本轮你〖慧视〗预言成功的次数获得以下技能效果： 一次：「qixi」；两次：「duanliang」；三次：「guose」；四次：「luanji」",
    },
};
