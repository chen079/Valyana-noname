import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    trigger: {
        global: "damageBegin3",
    },
    filter(event, player) {
        return event.num > 1
    },
    t: {
        name: '守望',
        info: '每回合限一次，当一名角色受到伤害时，若此伤害大于1，你可以失去1点体力，并取消此伤害。然后你可以选择一项：1.你与其摸各2X张牌；2.其交给你X张牌（X为本次受到的伤害值）。'
    },
    usable: 1,
    async content(event, trigger, player) {
        await player.loseHp()
        const num = trigger.num
        trigger.cancel()
        var list = [
            '你与其摸各' + 2 * num + '张牌',
            '其交给你' + num + '张牌',
        ];
        const result = await player.chooseControl().set('prompt', get.prompt('vl_shouwang')).set('choiceList', list).set('ai', function () {
            var player = _status.event.player;
            if (get.attitude(player, trigger.player) > 0) return 0;
            else return 1
        }).set('forced', true).forResult();
        if (result.index == 0) {
            await player.draw(2 * num)
            await trigger.player.draw(2 * num)
        } else {
            let cardnum = Math.min(num, trigger.player.countCards('he'))
            if (cardnum <= 0 || trigger.player == player) return event.finish()
            else {
                let result = await trigger.player.chooseCard('交给' + get.translation(player) + get.translation(cardnum) + '张牌', 'he', cardnum, true).set('ai', function (card) {
                    if (_status.event.goon) return 0;
                    return 5 - get.value(card);
                }).set('goon', get.attitude(trigger.player, player) >= 0).forResult();
            }
            await player.gain(result.cards, trigger.player, 'giveAuto')
        }
    },
    ai: {
        order: 7,
        result: {
            player(player, target) {
                if (player.hp <= 1) return -1
                var att = get.attitude(player, target)
                if (att < 0 && target.hp <= 2) return 0;
                else return 1
            }
        }
    }
}