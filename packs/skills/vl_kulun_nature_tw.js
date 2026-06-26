import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    linkage: "thunder",
    filterTarget(card, player, target) {
        return target != player
    },
    check(target) {
        let player = _status.event.player
        return -get.attitude(player, target)
    },
    filter(event, player) {
        return ((player.name1 == 'vl_kulun_thunder') || (player.name2 == 'vl_kulun_thunder'));
    },
    async content(event, trigger, player) {
        const num = game.getInCenter().filter(i => get.color(i) == 'black').length;
        for (let i = 0; i < num; i++) {
            await event.target.executeDelayCardEffect('shandian');
        }
    },
    ai: {
        order: 4,
        result: {
            target: -5,
        },
    },
    t: {
        name: "天威",
        info: `连携-雷电：出牌阶段限一次，你可以令一名角色进行X次闪电判定（X为${get.poptip("center")}黑色牌数）。`,
    },
};
