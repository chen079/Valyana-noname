import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    selectCard() {
        if (!ui.selected.targets.length) {
            const player = _status.event.player
            let maxHandSize = -1
            game.players.forEach(i => {
                if (i != player) {
                    if (i.getDamagedHp() > maxHandSize) {
                        maxHandSize = i.getDamagedHp();
                    }
                }
            });
            return [0, maxHandSize]
        } else {
            if (ui.selected.cards.length != ui.selected.targets[0].getDamagedHp()) {
                game.uncheck('target');
            } else {
                return ui.selected.targets[0].getDamagedHp()
            }
        }
    },
    filterCard: true,
    check(card) {
        return 7 - get.value(card)
    },
    discard: false,
    lose: false,
    delay: false,
    filterTarget: (card, player, target) => {
        return player != target && target.getDamagedHp() == ui.selected.cards.length
    },
    position: "he",
    filter: (event, player) => player.countCards('h') > 1,
    selectTarget: 1,
    async content(event, trigger, player) {
        const target = event.targets[0];
        const cards = event.cards;
        await player.give(cards, target)
        target.executeDelayCardEffect('bingliang')
        target.executeDelayCardEffect('lebu')
    },
    ai: {
        order: 4,
        result: {
            target(player, target) {
                return -3
            },
        },
    },
    group: "vl_rabby_qj_draw",
    subSkill: {
        draw: {
            trigger: {
                global: ["phaseUseSkipped", "phaseUseCancelled", "phaseDrawSkipped", "phaseDrawCancelled", "linkAfter"],
            },
            direct: true,
            content: () => {
                player.draw()
            },
        },
    },
    t: {
        name: "强拘",
        info: "出牌阶段限一次，你可交给一名其他角色X张牌（X为该角色的已损体力值），然后该角色依次进行一次【兵粮寸断】和【乐不思蜀】判定。当场上有角色改变横置状态、跳过出牌或摸牌阶段后，你摸一张牌。",
    },
};
