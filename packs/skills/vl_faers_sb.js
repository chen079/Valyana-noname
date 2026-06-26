import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    check(card) {
        let player = _status.event.player;
        if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
            return get.value(card) >= 8;
        }))) {
            return 1;
        }
        return 6 - get.value(card)
    },
    async content(event, trigger, player) {
        let card = player.getCards('h')
        player.discard(card)
    },
    ai: {
        order: 1,
        result: {
            player: 1,
        },
        threaten: 1.55,
    },
    t: {
        name: "嬗变",
        info: "出牌阶段限一次，你可以弃置你的全部手牌。",
    },
};
