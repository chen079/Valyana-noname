import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        targetInRange(card, player) {
            if (card.name == 'sha' && get.color(card) == 'black') return true;
        },
        cardUsable(card) {
            if (card.name == 'sha') return Infinity;
        },
        selectTarget(card, player, range) {
            if (card.name == 'sha' && range[1] != -1 && get.color(card) == 'black') {
                range[1]++;
            }
        },
    },
    trigger: {
        source: "damageBegin",
    },
    forced: true,
    filter(event, player) {
        return !get.is.altered('vl_kert_dp') && event.card && event.card.name == 'sha' && get.color(event.card) == 'red' && event.notLink();
    },
    async content(event, trigger, player) {
        trigger.num += 2;
    },
    group: "vl_kert_dp_1",
    subSkill: {
        "1": {
            trigger: {
                source: "dying",
            },
            forced: true,
            async content(event, trigger, player) {
                player.loseMaxHp();
                player.removeSkill('vl_kert_dp');
            },
            sub: true,
        },
    },
    t: {
        name: "夺魄",
        info: "锁定技，你的杀无次数限制，且黑色【杀】无距离限制并可以多指定一个目标；红色杀伤害+2；当你使一名角色进入濒死状态时，你失去该技能并减少1点体力上限。",
    },
};
