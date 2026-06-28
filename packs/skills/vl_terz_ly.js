import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    unique: true,
    zhuanhuanji: true,
    filter(event, player) {
        if (!player.getStorage('vl_terz_ly', false) && player.countCards('he') == 0) return false
        return true
    },
    async content(event, trigger, player) {
        if (player.getStorage('vl_terz_ly', false)) {
            await player.draw()
        } else {
            await player.chooseToDiscard('he', true)
        }
        if (!player.hasStorage('vl_terz_ly')) player.setStorage('vl_terz_ly', false)
        player.setStorage('vl_terz_ly', !player.getStorage('vl_terz_ly', false))
    },
    group: ["vl_terz_ly_target"],
    ai: {
        order: 8,
        result: {
            player() {
                return Math.random() * 2 - 1
            },
        },
    },
    subSkill: {
        target: {
            trigger: {
                player: ["damageAfter", "phaseEnd"],
                source: "damageAfter",
            },
            init(player) {
                player.setStorage('vl_terz_ly', false);
            },
            charlotte: true,
            unique: true,
            zhuanhuanji: true,
            forced: true,
            logTarget: "player",
            mod: {
                targetEnabled(card, player, target, now) {
                    if (player.getStorage('vl_terz_ly', false) == target.getStorage('vl_terz_ly', false) && player != target) return false;
                },
            },
            async content(event, trigger, player) {
                if (player.getStorage('vl_terz_ly', false)) {
                    await player.draw()
                } else {
                    await player.chooseToDiscard('he', true)
                }
                if (!player.hasStorage('vl_terz_ly')) player.setStorage('vl_terz_ly', false)
                player.setStorage('vl_terz_ly', !player.getStorage('vl_terz_ly', false))
            },
            sub: true,
        },
    },
    t: {
        name: "流域",
        info: "转换技。锁定技，出牌阶段限一次/回合结束时/当你受到或造成伤害结算完毕后，阴：你摸一张牌；阳：你弃置一张牌；你的牌只能指定你或与你〖流域〗状态不同的角色为目标。",
    },
};
