import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseUseBegin",
    },
    direct: true,
    filter: (event, player) => player.countVuffNum('kangfen') > 0,
    async content(event, trigger, player) {
        let num = player.countVuffNum('kangfen')
        if (num < player.countCards('he')) {
            const result = await player.chooseCard('重铸' + get.cnNumber(num) + '张牌', 'he', num, true).set('ai', function (card) {
                return 100 - get.value(card)
            }).forResult()
            if (result.bool) {
                await player.recast(result.cards)
            }
        } else {
            await player.recast(player.getCards('he'))
            player.addTempSkill("vl_kasers_kb_use")
            return
        }
    },
    subSkill: {
        use: {
            mark: true,
            intro: {
                content: "你的锦囊牌均视为【杀】",
            },
            onremove: true,
            mod: {
                cardname(card, player, name) {
                    let type = lib.card[card.name].type
                    if (type == 'trick' || type == 'delay') return 'sha';
                },
            },
        },
    },
    t: {
        name: "狂暴",
        info: "出牌阶段开始时，你重铸X张牌，若不足则全部重铸且本回合锦囊牌均视为【杀】（X为「亢奋」层数）。",
    },
};
