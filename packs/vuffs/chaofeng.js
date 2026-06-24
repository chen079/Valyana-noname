import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "嘲讽",
        content: "<li>当一名其他角色使用【杀】指定目标时，若你在其攻击范围内且你不是目标，你成为目标，然后移除1层「嘲讽」。",
    },
    trigger: {
        global: "useCardToPlayer",
    },
    charlotte: true,
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return event.player != player && event.card.name == 'sha' && !event.targets.includes(player) && event.player.inRange(player);
    },
    async content(event, trigger, player) {
        trigger.getParent().targets.push(player);
        trigger.player.line(player);
        await player.reduceVuff('chaofeng')
        await game.delay();
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1],
        }
    },
};
