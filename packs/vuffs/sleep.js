import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "睡眠",
        content: "<li>你的非锁定技失效且不能使用或打出手牌。<li>你受到伤害结算完毕后，「睡眠」层数-1。",
    },
    charlotte: true,
    init: function (player, skill) {
        player.addSkillBlocker(skill);
    },
    onremove: function (player, skill) {
        player.removeSkillBlocker(skill);
    },
    skillBlocker: function (skill, player) {
        return !lib.skill[skill].charlotte && !get.is.locked(skill, player) && !lib.skill[skill].persevereSkill;
    },
    mod: {
        cardEnabled: function (card, player) {
            if (player.hasVuff('sleep')) return false;
        },
        cardUsable: function (card, player) {
            if (player.hasVuff('sleep')) return false;
        },
        cardRespondable: function (card, player) {
            if (player.hasVuff('sleep')) return false;
        },
        cardSavable: function (card, player) {
            if (player.hasVuff('sleep')) return false;
        },
    },
    trigger: {
        player: "damageAfter",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('sleep')
    },
    async content(event, trigger, player) {
        await player.clearVuff("sleep");
    },
    // ai: {
    //     "directHit_ai": true,
    // },
    vuffInfo: {
        naturalLose: true,
        limit: 1,
        type: 'devuff',
        vuffRank: {
            basic: [0, 3.5],
            add: [0, 0.1],
        }
    },
};
