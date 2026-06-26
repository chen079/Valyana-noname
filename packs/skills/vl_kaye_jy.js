import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    position: "h",
    filterTarget: true,
    async content(event, trigger, player) {
        const target = event.target
        target.addVuff('jianren', player, 2)
    },
    ai: {
        order: 7,
        threaten: 1.6,
        expose: 0.2,
        result: {
            target: 2,
        },
    },
    t: {
        name: "急援",
        info: "出牌阶段限一次，你可以弃置一张手牌并选择一名角色，若如此做，你令该角色获得2层「坚韧」。",
    },
};
