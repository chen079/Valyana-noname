import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "drawAfter",
    },
    usable: 2,
    check(event, player) {
        if (get.attitude(player, event.player) >= 0) return false;
        if (get.effect(event.player, { name: 'sha' }, player, player) <= 0) return false;
        if (get.effect(player, { name: 'sha' }, event.player, player) >= 0) return true;
        return player.hasShan() && player.hp >= event.player.hp;
    },
    filter(event, player) {
        return player != event.player && Array.isArray(event.result) && event.result.length > 0;
    },
    logTarget: "player",
    async content(event, trigger, player) {
        player.viewCards(get.translation(trigger.player) + '摸到的牌', trigger.result);
        if (!event.isMine()) {
            game.delayx();
        }
        const list = [];
        for (let i = 0; i < trigger.result.length; i++) {
            if (trigger.result[i].name == 'sha') {
                list.push(trigger.result[i]);
            }
        }
        if (list.length) {
            await player.useCard({ name: 'sha', nature: 'thunder' }, trigger.player);
        } else {
            await trigger.player.useCard({ name: 'sha', nature: 'thunder' }, player);
        }
    },
    t: {
        name: "疑计",
        info: "每回合限两次，其他角色摸牌后，你可以观看其摸到的牌，若其中有【杀】，则视为你对其使用一张【杀】，若其中没有【杀】，则视为其对你使用一张【杀】（计入出杀次数）",
    },
};
