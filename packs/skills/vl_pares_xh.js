import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        player: "damageEnd",
        source: "damageSource",
    },
    filter(event, player) {
        return player.hp != player.countCards('h')
    },
    async content(event, trigger, player) {
        var num = player.hp - player.countCards('h')
        if (num > 0) {
            player.draw(num)
        } else {
            player.chooseToDiscard('h', -num, true)
            player.draw()
        }
    },
    t: {
        name: "星汇",
        info: "锁定技，当你造成或受到伤害后，将你的手牌数调整为你的当前体力值，若你因此失去了牌，你摸一张牌。",
    },
};
