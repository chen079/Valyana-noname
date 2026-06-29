import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "drawAfter",
    },
    filter(event, player, onrewrite) {
        return player.group == 'wei' && event.player.isMaxHandcard(true) && event.player.group != player.group
    },
    direct: true,
    async content(event, trigger, player) {
        const result = await player.chooseBool('是否将势力改为与' + get.translation(trigger.player) + '相同（' + get.translation(trigger.player.group) + '）').set("ai", () => true).forResult();
        if (result.bool) {
            player.changeGroup(trigger.player.group)
        }
    },
    group: "vl_akain_bx_ice",
    subSkill: {
        ice: {
            trigger: {
                source: ["damageBefore"],
            },
            direct: true,
            filter(event, player) {
                return player.group == 'wei'
            },
            async content(event, trigger, player) {
                game.setNature(trigger, 'ice');
            },
        },
    },
    t: {
        name: "冰心",
        info: "魏势力技，你造成的伤害视为冰属性。一名角色摸牌后，若其的手牌数达到全场唯一最多且与你势力不同，你可以加入其势力。",
        taici: ["霜火同源，立场先行。", "谁站在强的一边，答案就很清楚。"],
    },
};
