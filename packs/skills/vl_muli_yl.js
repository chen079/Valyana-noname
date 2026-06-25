import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        global: "loseHpBegin",
    },
    filter(event, player) {
        return event.num > 0
    },
    content: async function content(event, trigger, player) {
        await player.draw(trigger.num)
        if (trigger.player == player) {
            if (trigger.num > 1) trigger.num = 1
        }
    },
    t: {
        name: "远虑",
        info: "锁定技，一名角色失去体力时，你摸失去量的牌，然后若该角色为你，改为仅失去1点。",
    },
};
