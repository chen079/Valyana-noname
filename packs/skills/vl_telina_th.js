import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    init(player) {
        if (!player.hasStorage('vl_telina_th')) player.setStorage('vl_telina_th', 0)
    },
    mark: true,
    intro: {
        content(storage, player, skill) { return '当前有' + storage + '个标记' },
    },
    async content(event, trigger, player) {
        if (player.getStorage('vl_telina_th', 0) > 0) { player.addTempSkill("qixi", "phaseEnd") }
        if (player.getStorage('vl_telina_th', 0) > 1) { player.addTempSkill("duanliang", "phaseEnd") }
        if (player.getStorage('vl_telina_th', 0) > 2) { player.addTempSkill("guose", "phaseEnd") }
        if (player.getStorage('vl_telina_th', 0) > 2) { player.addTempSkill("luanji", "phaseEnd") }
    },
    group: "vl_telina_th_int",
    subSkill: {
        int: {
            forced: true,
            trigger: {
                player: "phaseAfter",
            },
            async content(event, trigger, player) {
                player.setStorage('vl_telina_th', 0)
                player.updateMark("vl_telina_th")
            },
            sub: true,
        },
    },
    t: {
        name: "预见",
        info: `你的回合开始时，根据本轮你${get.poptip("vl_telina_hs")}预言成功的次数获得以下技能效果： 一次：${get.poptip("qixi")}；两次：${get.poptip("duanliang")}；三次：${get.poptip("guose")}；四次：${get.poptip("luanji")}`,
    },
};
