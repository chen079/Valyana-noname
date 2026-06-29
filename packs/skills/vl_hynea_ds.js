import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    unique: true,
    filter(event, player) {
        return player.getStorage('vl_hynea_cg', 0) > 0
    },
    check(event, player) {
        return player.getStorage('vl_hynea_cg', 0) > player.hp
    },
    filterTarget(card, player, target) {
        return player != target;
    },
    async content(event, trigger, player) {
        const target = event.target
        player.setStorage('vl_hynea_cg', player.getStorage('vl_hynea_cg', 0) - 1)
        await target.damage(1, player)
        player.updateMark('vl_hynea_cg')
    },
    ai: {
        order: 9.5,
        expose: 0.2,
        result: {
            player: 1,
            target: -1,
        },
    },
    t: {
        name: "登险",
        info: `出牌阶段限一次，你可以令${get.poptip("vl_hynea_cg")}中[]内的数字-1（至少为0），然后对一名其他角色造成1点伤害。`,
    },
};
