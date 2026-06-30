import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["loseAfter"],
    },
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    forced: true,
    init(player) {
        player.addSkill("vl_sainit_yq_count");
        if (!player.getStorage('vl_sainit_yq', null)) player.setStorage('vl_sainit_yq', false)
    },
    filter(event, player) {
        if (event.getParent(3).name != "vl_sainit_jh_discard") return;
        if (!(event.type == "discard" && event.getl(player)?.cards2?.length)) return;
        return player.countMark("vl_sainit_yq_count") >= 12;
    },
    async content(event, trigger, player) {
        player.awakenSkill('vl_sainit_yq')
        player.setStorage('vl_sainit_yq', true)
        player.unmarkSkill('vl_sainit_yq')
        player.addSkill('vl_sainit_yj')
        game.log(player, '移除了', '#g【镜华②】')
    },
    derivation: "vl_sainit_yj",
    subSkill: {
        count: {
            trigger: {
                player: ["loseAfter"],
            },
            mark: true,
            marktext: "影",
            intro: {
                name: "影倾",
                mark(dialog, storage, player) {
                    dialog.addText("你因【镜华】弃置了" + (player.countMark("vl_sainit_yq_count") || 0) + "张牌");
                },
            },
            forced: true,
            firstDo: true,
            charlotte: true,
            filter(event, player) {
                if (event.getParent(3).name != "vl_sainit_jh_discard") return;
                if (!(event.type == "discard" && event.getl(player)?.cards2?.length)) return;
                return true;
                // return event.type == "discard" && event.getl(player).cards2.length;
            },
            async content(event, trigger, player) {
                player.addMark("vl_sainit_yq_count", trigger.getl(player)?.cards2?.length);
            },
        },
    },
    t: {
        name: "影倾",
        info: `觉醒技，当你因${get.poptip("vl_sainit_jh")}②累计弃置不小于12张牌时,你获得${get.poptip("vl_sainit_yj")}并移除${get.poptip("vl_sainit_jh")}②。`,
    },
};
