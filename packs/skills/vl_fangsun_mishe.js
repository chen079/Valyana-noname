import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    trigger: {
        player: "dying",
    },
    t: {
        name: '靡奢',
        info: '锁定技，每回合限一次，当你进入濒死状态时，你可以将体力回复至1点，然后摸X张牌（X为你已损失的体力值）。',
        taici: ['看着我，然后忘记反抗。', '迷蛇入瞳，意志归王。'],
    },
    usable: 1,
    logTarget: "player",
    content(event, trigger, player) {
        player.recoverTo(1);
        player.draw(player.maxHp - player.hp);
    },
    ai: {
        result: {
            player: 1
        }
    }
}