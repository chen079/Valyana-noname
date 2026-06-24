import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "优势",
        content: "<li>当你使用牌时，可以令一名其他目标角色交给你一张牌。然后你移除1层「<font color=green>优势</font>」。",
    },
    trigger: {
        player: "useCard1"
    },
    forced: true,
    silent: true,
    charlotte: true,
    priority: 3,
    filter: (event, player) => game.hasPlayer(target => target != player && event.targets.includes(target) && target.countCards('he') > 0),
    async content(event, trigger, player) {
        const targetResult = await player.chooseTarget('令一名不为你的目标角色交给你一张牌', 1)
            .set('filterTarget', (card, player, target) => target != player && trigger.targets.includes(target) && target.countCards('he') > 0)
            .set('ai', target => -get.attitude(player, target))
            .forResult();
        if (targetResult.bool) {
            event.target = targetResult.targets[0]
            const cardResult = await event.target.chooseCard('he', true, '将一张牌交给' + get.translation(player) + '。').forResult();
            if (!cardResult.bool) return;
            await event.target.give(cardResult.cards, player, true);
            await player.reduceVuff('youshi')
        } else {
            event.finish()
            return;
        }
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [2, 0],
            random: [0.25, 0],
            randomPower: 1.5,
        },
        type: 'vuff',
        limit: 3,
        vuffReject: ["lieshi"]
    },
};
