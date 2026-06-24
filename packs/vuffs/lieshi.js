import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "劣势",
        content: "<li>当你使用牌时，若你有牌，交给一名其他目标角色一张牌，然后你移除1层「<font color=red>劣势</font>」。",
    },
    trigger: {
        player: "useCard1"
    },
    forced: true,
    charlotte: true,
    silent: true,
    priority: 3,
    filter: (event, player) => player.countCards('he') > 0 && game.hasPlayer(target => target != player && event.targets.includes(target)),
    async content(event, trigger, player) {
        const result = await player.chooseCardTarget({
            position: 'he',
            prompt: '交给不为你的一名目标角色一张牌',
            forced: true,
            selectTarget: 1,
            selectCard: 1,
            filterTarget: (card, player, target) => target != player && trigger.targets.includes(target),
            ai1: function (card) {
                return 10 - get.value(card);
            },
            ai2: function (target) {
                const att = get.attitude(_status.event.player, target);
                if (_status.event.du) {
                    if (target.hasSkillTag('nodu')) return 0.5;
                    return -att;
                }
                if (att > 0) {
                    if (_status.event.player != target) att += 2;
                    return att + Math.max(0, 5 - target.countCards('h'));
                }
                return att;
            }
        }).forResult();
        if (result.bool) {
            await player.give(result.cards, result.targets[0], true)
            await player.reduceVuff('lieshi')
        }
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [0, 2],
            random: [0, 0.25],
            randomPower: 1.5,
        },
        type: 'devuff',
        limit: 3,
        vuffReject: ["youshi"]
    },
};
