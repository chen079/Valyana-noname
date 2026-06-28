import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    filter(event, player) {
        return event.player != player
    },
    forced: true,
    async content(event, trigger, player) {
        trigger.player.addSkill('vl_dragon_hy_damage')
        trigger.player.setStorage('vl_dragon_hy_damage', trigger.player.getStorage('vl_dragon_hy_damage', 0) + 1)
        await trigger.player.loseMaxHp()
        trigger.player.updateMark('vl_dragon_hy_damage')
    },
    subSkill: {
        damage: {
            unique: true,
            init(player) {
                if (!player.hasStorage('vl_dragon_hy_damage')) player.setStorage('vl_dragon_hy_damage', 0);
            },
            filter(event, player) {
                return player.getStorage('vl_dragon_hy_damage', 0)
            },
            mark: true,
            intro: {
                content: "结束阶段，你选择一项：1.弃置X张牌；2.受到X点火焰伤害（X为你的“黑焰”标记数）。",
            },
            forced: true,
            trigger: {
                player: "phaseUseEnd",
            },
            async content(event, trigger, player) {
                const result = await player.chooseToDiscard('he', player.getStorage('vl_dragon_hy_damage', 0)).set('ai', function (card) {
                    if (card.name == 'tao') return -10;
                    if (card.name == 'jiu' && _status.event.player.hp == 1) return -10;
                    return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
                }).forResult();
                if (result.bool == false) {
                    await player.damage(player.getStorage('vl_dragon_hy_damage', 0), 'fire', 'nosource');
                }
                await player.gainMaxHp(player.getStorage('vl_dragon_hy_damage', 0))
                player.setStorage('vl_dragon_hy_damage', 0)
                player.removeSkill('vl_dragon_hy_damage')
            },
            sub: true,
        },
    },
    t: {
        name: "黑焰",
        info: "锁定技，当你对其他角色造成伤害后，该角色获得一个“黑焰”标记并减少1点体力上限；每名角色的出牌阶段结束时，若其有“黑焰”，其须选择一项：1.弃置X张牌，2.受到X点火焰伤害；然后移除所有“黑焰”标记并增加X点体力上限（X为其“黑焰”标记数）。",
    },
};
