import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    frequent: true,
    filter(event, player) {
        return event.player != player && event.player.isIn() && !player.getHistory("useCard").length;
    },
    async content(event, trigger, player) {
        const target = trigger.player;
        const result = await player.chooseBool(get.prompt("vl_sainit_yj", target), "将牌堆顶的一张牌置于其武将牌上，称为“月华”。").set("ai", function () {
            const player = _status.event.player;
            const target = _status.event.getTrigger().player;
            return get.attitude(player, target) <= 0 || target.getExpansions("vl_sainit_yj_yuehua").length == 0;
        }).set("frequentSkill", "vl_sainit_yj").forResult();
        if (!result.bool) return;
        player.logSkill(event.name, target);
        await lib.skill.vl_sainit_yj.addYuehua(target);
        if (!lib.filter.targetEnabled({ name: "sha", isCard: true }, player, target)) return;
        const shaResult = await player.chooseBool("月皎：是否视为对" + get.translation(target) + "使用一张无距离限制的冰【杀】？").set("ai", function () {
            const player = _status.event.player;
            const target = _status.event.target;
            return get.effect(target, { name: "sha", nature: "ice" }, player, player) > 0;
        }).set("target", target).forResult();
        if (!shaResult.bool) return;
        await player.useCard({
            name: "sha",
            nature: "ice",
            isCard: true,
            storage: {
                vl_sainit_yj: true,
                vl_sainit_yj_target: target,
            },
        }, target, false).set("addCount", false);
    },
    async addYuehua(target) {
        target.addSkill("vl_sainit_yj_yuehua");
        await target.addToExpansion(get.cards(1), "gain2").gaintag.add("vl_sainit_yj_yuehua");
    },
    group: "vl_sainit_yj_sha_damage",
    subSkill: {
        yuehua: {
            charlotte: true,
            marktext: "月",
            intro: {
                markcount: "expansion",
                mark(dialog, content, player) {
                    const cards = player.getExpansions("vl_sainit_yj_yuehua");
                    if (cards.length) dialog.addAuto(cards);
                },
                content(content, player) {
                    const cards = player.getExpansions("vl_sainit_yj_yuehua");
                    if (cards.length) return get.translation(cards);
                },
            },
            onremove(player, skill) {
                const cards = player.getExpansions(skill);
                if (cards.length) player.loseToDiscardpile(cards);
            },
        },
        sha_damage: {
            charlotte: true,
            trigger: {
                source: "damageEnd",
            },
            forced: true,
            popup: false,
            priority: 20,
            filter(event, player) {
                return event.card?.name == "sha" && event.card.storage?.vl_sainit_yj && event.player == event.card.storage.vl_sainit_yj_target;
            },
            async content(event, trigger, player) {
                await lib.skill.vl_sainit_yj.addYuehua(trigger.player);
            },
        },
    },
    t: {
        name: "月皎",
        info: "其他角色回合结束时，若你于此回合内未使用过牌，你可以将牌堆顶的一张牌置于其武将牌上，称为“月华”。若如此做，你可以视为对其使用一张无距离限制的冰【杀】；若此【杀】造成了伤害，你将牌堆顶的一张牌置于其武将牌上，称为“月华”。",
    },
};
