import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
        return target != player
    },
    selectTarget() {
        return ui.selected.cards.length
    },
    complexCard: true,
    filterCard(card) {
        if (ui.selected.cards.length) {
            return get.color(card) != get.color(ui.selected.cards[0]);
        }
        return true;
    },
    position: "he",
    filter(event, player) {
        return player.countCards('he') > 0
    },
    selectCard: [1, 2],
    async content(event, trigger, player) {
        const target = event.target
        target.damage(player, 'fire')
        target.addVuff('ranshao')
    },
    ai: {
        order: 9,
        result: {
            target: -3,
        },
    },
    t: {
        name: "燎原",
        info: "出牌阶段限一次，你可以弃置至多两张颜色不同的牌，对等量其他角色造成1点火焰伤害并令他们获得1层「燃烧」。",
    },
};
