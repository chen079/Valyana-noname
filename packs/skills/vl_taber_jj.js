import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
        const targetResult = await player.chooseTarget([1, Math.ceil(game.countPlayer() / 2)], function (card, player, target) {
            return target.countCards('h')
        }, true).set('ai', function (target) {
            var player = _status.event.player
            return get.attitude(player, target)
        }).forResult();
        if (!targetResult.bool) return;
        event.targets = targetResult.targets;
        event.targets.sortBySeat();
        var cards = get.cards(targetResult.targets.length);
        var dialog = ui.create.dialog('掘金', cards, true)
        event.dialog = dialog
        while (event.targets.length) {
            event.target = event.targets.shift()
            var minValue = 20;
            var hs = event.target.getCards('h');
            for (var i = 0; i < hs.length; i++) {
                minValue = Math.min(minValue, get.value(hs[i], event.target));
            }
            if (event.target.isUnderControl(true)) {
                event.dialog.setCaption('选择一张牌并用一张手牌替换之');
            }
            var next = event.target.chooseButton(function (button) {
                return get.value(button.link, _status.event.player) - minValue;
            });
            next.set('dialog', event.dialog);
            next.set('closeDialog', false);
            next.set('dialogdisplay', true);
            const buttonResult = await next.forResult();
            event.dialog.setCaption('掘金');
            if (buttonResult.bool) {
                event.button = buttonResult.buttons[0];
                const cardResult = await event.target.chooseCard('用一张牌牌替换' + get.translation(buttonResult.links), true).forResult();
                if (cardResult.bool) {
                    event.target.lose(cardResult.cards, ui.special);
                    event.target.$throw(cardResult.cards);
                    game.log(event.target, '用', cardResult.cards, '替换了', event.button.link);
                    event.target.gain(event.button.link);
                    event.target.$gain2(event.button.link);
                    event.dialog.buttons.remove(event.button);
                    event.dialog.buttons.push(ui.create.button(cardResult.cards[0], 'card', event.button.parentNode));
                    event.button.remove();
                }
            }
            else {
                event.target.popup('不换');
                game.log(event.target, '不替换')
            }
            game.delay(2);
        }
        const remaining = [];
        for (var i = 0; i < event.dialog.buttons.length; i++) {
            remaining.push(event.dialog.buttons[i].link)
        }
        event.cards = remaining
        const finalTarget = await player.chooseTarget(1, true).set('prompt', '将剩余的牌交给一名角色').forResult();
        event.dialog.close()
        if (finalTarget.bool) {
            finalTarget.targets[0].gain(event.cards, 'gain2')
        }
    },
    ai: {
        order: 7,
        result: {
            player: 1,
        },
    },
    t: {
        name: "度衡",
        info: "出牌阶段限一次，你可以选择至多X名角色并展示牌堆顶等量的牌（X为场上存活的人数并向上取整），然后这些角色依次选择是否用一张手牌交换其中的一张牌；结算完毕后，你令一名角色获得剩余的所有牌。",
    },
};
