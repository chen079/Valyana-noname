import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    usable: 1,
    enable: "phaseUse",
    filter(event, player) {
        return player.countCards('hes') > 2
    },
    filterCard: true,
    filterTarget(card, player, target) {
        return target != player
    },
    position: "hes",
    selectCard: 2,
    check(card) {
        return 7 - get.value(card)
    },
    async content(event, trigger, player) {
        const target = event.target;
        await player.recover()
        await target.damage(1, player, 'unreal')
    },
    ai: {
        order: 5,
        result: {
            target(player, target) {
                if (target.hp == 1) return 5;
                if (player.countCards('h') > player.hp) return 4;
                if (target.hp == target.maxHp) return 0
                return 2;
            },
            player(player, target) {
                if (player.hp == 1) return 5
                if (player.hp == player.maxHp) return 0
                return 2
            },
        },
    },
    t: {
        name: "视新",
        info: "出牌阶段限一次，你可以弃置两张牌并回复1点体力，然后<font color=\"purple\">视为</font>对一名其他角色造成<font color=\"purple\">过</font>1点伤害。",
    },
};
