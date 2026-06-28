import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageEnd",
    },
    sunbenSkill: true,
    direct: true,
    priority: 0,
    filter(event, player) {
        return event.player != player && event.player.isIn() && event.player.getExpansions("vl_sainit_yj_yuehua").length;
    },
    async content(event, trigger, player) {
        const target = trigger.player;
        const cards = target.getExpansions("vl_sainit_yj_yuehua");
        const damageCards = cards.filter(card => get.tag(card, "damage") > 0);
        const result = await player.chooseBool(get.prompt("vl_sainit_jh", target), "获得其所有“月华”，然后视为对其依次使用其中所有的伤害类牌。").set("ai", function () {
            const player = _status.event.player;
            const target = _status.event.getTrigger().player;
            return get.attitude(player, target) <= 0 || _status.event.damageCards.length > 0;
        }).set("damageCards", damageCards).forResult();
        if (!result.bool) return;
        player.logSkill(event.name, target);
        player.removeSkill("vl_sainit_jh_sunben");
        player.awakenSkill(event.name);
        player.addSkill("vl_sainit_jh_sunben");
        await player.gain(cards, target, "giveAuto");
        if (!target.getExpansions("vl_sainit_yj_yuehua").length) target.removeSkill("vl_sainit_yj_yuehua");
        for (const card of damageCards) {
            if (!player.getCards("h").includes(card)) continue;
            if (!target.isIn()) break;
            if (player.canUse(card, target, false)) {
                await player.useCard(card, target, false).set("addCount", false);
            }
        }
    },
    subSkill: {
        sunben: {
            charlotte: true,
            trigger: {
                player: "damageEnd",
            },
            intro: {
                content: "需要受到伤害后才能发动",
            },
            mark: true,
            forced: true,
            popup: false,
            firstDo: true,
            async content(event, trigger, player) {
                player.removeSkill(event.name);
                if (player.hasSkill("vl_sainit_jh", null, null, false) && !player.hasSkill("vl_sainit_jh")) {
                    player.popup("镜华");
                    player.restoreSkill("vl_sainit_jh");
                    game.log(player, "恢复了技能", "#g【镜华】");
                }
            },
        },
    },
    t: {
        name: "镜华",
        info: `昂扬技。当你对有“月华”的角色造成伤害时，你可以获得其所有“月华”，若如此做，你视为对其依次使用其中所有的伤害类牌。<br>${get.poptip("rule_jiang")}：你受到伤害后。`,
        taici: ['剑痕交汇，旧誓重燃。', '此身未倒，荣光不灭。'],
    },
};
