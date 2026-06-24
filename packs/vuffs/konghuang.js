import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
            intro: {
                name: "恐慌",
                content: "<li>你的非锁定技在回合内失效，你不能对其他角色使用牌。",
            },
            init: function (player, skill) {
                player.addSkillBlocker(skill);
            },
            onremove: function (player, skill) {
                player.removeSkillBlocker(skill);
            },
            skillBlocker: function (skill, player) {
                if (!player.hasVuff('konghuang')) return;
                if (!_status.currentPhase || _status.currentPhase != player) return;
                return !lib.skill[skill].charlotte && !get.is.locked(skill, player) && !lib.skill[skill].persevereSkill;
            },
            charlotte: true,
            forced: true,
            silent: true,
            mod: {
                playerEnabled: function (card, player, target) {
                    if (!player.hasVuff('konghuang')) return;
                    if (player != target) return false;
                },
            },
            vuffInfo: {
                naturalLose: true,
                type: 'devuff',
                limit: 5,
                vuffRank: {
                    basic: [0, -2.5],
                },
            }
        };
