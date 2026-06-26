import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    qianghua: true,
    usable: 1,
    enable: "phaseUse",
    filterTarget(card, player, target) {
        return target != player
    },
    check(player, target) {
        return get.attitude(player, target) < 0
    },
    async content(event, trigger, player) {
        const target = event.target
        await target.loseHp()
        await player.recover()
        if (player.hasSkill('_qianghua_effect')) {
            if (player.isHealthy()) {
                await player.draw(2)
            } else {
                await target.turnOver()
                await target.draw(target.getDamagedHp())
            }
        }
        player.removeSkill('_qianghua_effect');
    },
    ai: {
        order: 4,
        result: {
            target: -2,
            player: 2,
        },
        threaten: 2,
        expose: 0.2,
    },
    t: {
        name: "灵链",
        info: `${get.poptip("qianghua")}，出牌阶段限一次，你可以令一名其他角色失去1点体力，然后你回复1点体力。强化：然后若你未受伤，你摸两张牌，否则，该角色翻面并摸X张牌（X为该角色的已损体力值）。`,
    },
};
