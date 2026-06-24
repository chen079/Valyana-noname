import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "庇护",
        content: "<li>当你成为其他角色普通锦囊牌的目标后，令此牌对你无效。<li>你不会成为【乐不思蜀】和【兵粮寸断】的目标。",
    },
    trigger: {
        target: "useCardToTargeted",
    },
    charlotte: true,
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return get.type(event.card) == 'trick' && event.player != player;
    },
    async content(event, trigger, player) {
        game.log(player, '受「<font color=yellow>庇护</font>」影响，', trigger.card, '对', trigger.target, '失效')
        trigger.getParent().excluded.add(player);
    },
    mod: {
        targetEnabled: function (card, player, target, now) {
            if (card.name == 'bingliang' || card.name == 'lebu') return false;
        },
    },
    ai: {
        effect: {
            target: function (card, player, target, current) {
                if (get.type(card) == 'trick') return 'zeroplayertarget';
            },
        },
    },
    vuffInfo: {
        naturalLose: true,
        limit: 1,
        type: 'vuff',
        vuffRank: {
            basic: [1, 0.1],
        }
    },
};
