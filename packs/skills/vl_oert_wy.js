import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    firstDo: true,
    logTarget(event, player) {
        return game.filterPlayer(function (current) {
            return current.isAlive();
        });
    },
    forced: true,
    async content(event, trigger, player) {
        game.countPlayer(function (current) {
            if (current != player) {
                current.addTempSkill('baiban')
            }
        });
    },
    group: ["vl_oert_wy_nouse"],
    subSkill: {
        nouse: {
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            logTarget(event, player) {
                return game.filterPlayer(function (current) {
                    return current.isAlive();
                });
            },
            lastDo: true,
            forced: true,
            async content(event, trigger, player) {
                const list = game.filterPlayer(function (current) {
                    return current.isAlive();
                }).sortBySeat();
                list.remove(player);
                for (const current of list) {
                    current.addTempSkill("qinggang2");
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
