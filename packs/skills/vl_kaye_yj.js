import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
        if (!player.hasStorage('vl_kaye_yj')) return true;
        return game.hasPlayer(function (current) {
            return !player.getStorage('vl_kaye_yj', []).includes(current);
        });
    },
    filterTarget(card, player, target) {
        return (!player.hasStorage('vl_kaye_yj') || !player.getStorage('vl_kaye_yj', []).includes(target) && target != player);
    },
    init(player) {
        if (!player.hasStorage('vl_kaye_yj')) player.setStorage('vl_kaye_yj', []);
    },
    async content(event, trigger, player) {
        const target = event.target
        target.addVuff('xuruo', 5, player)
        target.addVuff('yishang', 2, player)
        if (!player.hasStorage('vl_kaye_yj')) player.setStorage('vl_kaye_yj', []);
        player.markAuto('vl_kaye_yj', target);
        player.getStorage('vl_kaye_yj', []).sortBySeat()
    },
    ai: {
        order: 7,
        threaten: 1.6,
        expose: 0.2,
        result: {
            target(player, target) {
                return -1;
            },
        },
    },
    intro: {
        markcount: () => undefined,
        content: `已对$发动过${get.poptip("vl_kaye_yj")}`,
    },
    t: {
        name: "压制",
        info: "出牌阶段，你可以选择一名其他角色，若如此做，你令该角色获得2层「易伤」和5层「虚弱」。每名角色限一次。",
    },
};
