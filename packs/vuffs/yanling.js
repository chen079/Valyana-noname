import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "言灵",
        content: "<li>一名角色的判定牌生效前，你可以打出一张牌代替之。<li>然后你移除1层「<font color=green>言灵</font>」",
    },
    forced: true,
    silent: true,
    charlotte: true,
    trigger: {
        global: "judge",
    },
    filter(event, player) {
        return player.countCards(get.mode() == 'guozhan' ? 'hes' : 'hs') > 0 && player.hasVuff('yanling');
    },
    priority: 3,
    async content(event, trigger, player) {
        const result = await player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' +
            get.translation(trigger.player.judging[0]) + '，' + get.prompt('vuff_yanling'), get.mode() == 'guozhan' ? 'hes' : 'hs', function (card) {
                const player = _status.event.player;
                const mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                if (mod2 != 'unchanged') return mod2;
                const mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                if (mod != 'unchanged') return mod;
                return true;
            }).set('ai', function (card) {
                const trigger = _status.event.getTrigger();
                const player = _status.event.player;
                const judging = _status.event.judging;
                const result = trigger.judge(card) - trigger.judge(judging);
                const attitude = get.attitude(player, trigger.player);
                if (attitude == 0 || result == 0) return 0;
                if (attitude > 0) {
                    return result - get.value(card) / 2;
                }
                else {
                    return -result - get.value(card) / 2;
                }
            }).set('judging', trigger.player.judging[0]).forResult();
        if (result.bool) {
            await player.respond(result.cards, 'vuff_yanling', 'highlight', 'noOrdering');
        }
        else {
            event.finish();
            return;
        }
        if (result.bool) {
            if (trigger.player.judging[0].clone) {
                trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                game.broadcast(function (card) {
                    if (card.clone) {
                        card.clone.classList.remove('thrownhighlight');
                    }
                }, trigger.player.judging[0]);
                game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
            }
            game.cardsDiscard(trigger.player.judging[0]);
            trigger.player.judging[0] = result.cards[0];
            trigger.orderingCards.addArray(result.cards);
            game.log(trigger.player, '的判定牌改为', result.cards[0]);
            await player.reduceVuff('yanling')
            await game.delay(2);
        }
    },
    ai: {
        rejudge: true,
        tag: {
            rejudge: 1,
        },
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [1, 0],
            add: [0.5, 0],
            random: [1, 0]
        },
        type: 'vuff',
    },
};
