import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
    },
    t: {
        name: "连破",
        info: "锁定技，你的回合内，有角色失去所有手牌后，你对其造成1点伤害，并摸四张牌。你对手牌数不小于你的角色造成伤害+X。（X为本回合你造成过伤害次数）",
    },
    getIndex(event, player) {
        if (_status.currentPhase !== player || !event.getl) {
            return [];
        }
        return game.filterPlayer(current => {
            if (!current.isAlive() || current.countCards("h")) {
                return false;
            }
            const evt = event.getl(current);
            return evt && evt.hs && evt.hs.length > 0;
        }).sortBySeat();
    },
    filter(event, player, name, target) {
        if (!target?.isAlive() || target.countCards("h")) {
            return false;
        }
        if (_status.currentPhase !== player) {
            return false;
        }
        const evt = event.getl(target);
        return evt && evt.hs && evt.hs.length > 0;
    },
    logTarget: (event, player, name, target) => target,
    forced: true,
    async content(event, trigger, player) {
        const target = event.indexedData;
        await target.damage(1, player)
        await player.draw(4);
    },
    group: "vl_miya_ks_addDamage",
    subSkill: {
        addDamage: {
            direct: true,
            trigger: { source: "damageBegin1" },
            async content(event, trigger, player) {
                player
                    .when({ global: "changeHp" })
                    .step(async (event, trigger, player) => {
                        player.markSkill("vl_miya_ks_addDamage")
                    })
                if (trigger.player.countCards("h") < player.countCards("h")) return;
                player.logSkill("vl_miya_ks_addDamage")
                trigger.num += player.getHistory("sourceDamage")?.length || 0
            },
            mark: true,
            intro: {
                markcount(storage, player) {
                    return player.getHistory("sourceDamage")?.length || 0;
                },
                content(storage, player) {
                    return `本回合已造成${player.getHistory("sourceDamage")?.length || 0}次伤害`
                },
            }
        }
    }
}
