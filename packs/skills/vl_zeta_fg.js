import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardAfter",
    },
    init(player) {
        if (!player.getStorage('vl_zeta_fg', null)) player.setStorage('vl_zeta_fg', ['basic', 'trick', 'equip'])
    },
    filter(event, player) {
        return event.card && player.getStorage('vl_zeta_fg', []).includes(get.type2(event.card))
    },
    frequent: true,
    mark: true,
    intro: {
        mark(dialog, storage, player) {
            dialog.addText('目前可用的类型');
            const list = []
            const types = player.getStorage('vl_zeta_fg', []);
            for (let i = 0; i < types.length; i++) {
                list.push(get.translation(types[i]) + '牌')
            }
            dialog.addText(list.join('、'))
        },
    },
    async content(event, trigger, player) {
        player.getStorage('vl_zeta_fg', []).remove(get.type2(trigger.card))
        const result = await player.chooseControl('基本牌', '非基本牌').set('prompt', '请选择你想检索牌的类型').set('ai', function () {
            return ['基本牌', '非基本牌'].randomGet()
        }).forResult()
        player.setStorage('index', result.index)
        const index = player.getStorage('index', 0)
        while (true) {
            const cards = get.cards()
            if (index == 0) {
                if (get.type2(cards[0]) == 'basic') {
                    await player.gain(cards)
                    return
                } else {
                    await player.discard(cards)
                    continue;
                }
            } else {
                if (get.type2(cards[0]) != 'basic') {
                    await player.gain(cards)
                    return
                } else {
                    await player.discard(cards)
                    continue;
                }
            }
        }
    },
    group: "vl_zeta_fg_1",
    subSkill: {
        "1": {
            trigger: {
                global: "roundStart",
                player: "enterGame",
            },
            forced: true,
            unique: true,
            async content(event, trigger, player) {
                player.setStorage('vl_zeta_fg', ['basic', 'trick', 'equip'])
                player.updateMark('vl_zeta_fg')
            },
            sub: true,
        },
    },
    t: {
        name: "复归",
        info: "每轮每种类别限一次，你使用牌结算完毕后，你可以从牌堆中检索一张基本牌或非基本牌。",
    },
};
