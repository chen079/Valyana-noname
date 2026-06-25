import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    frequent: true,
    async content(event, trigger, player) {
        const result = await player.judge().forResult();
        if (result.suit == 'heart') {
            await player.recover()
        } else if (result.suit == 'diamond') {
            await player.draw(2)
        } else if (result.suit == 'club') {
            await player.discardPlayerCard(1, 'he', trigger.player)
        } else if (result.suit == 'spade') {
            if (!trigger.player.storage.vl_aak_hy_1) trigger.player.storage.vl_aak_hy_1 = 0
            trigger.player.storage.vl_aak_hy_1 += 1
            trigger.player.addTempSkill('vl_aak_hy_1', { player: "phaseEnd" })
        }
    },
    subSkill: {
        "1": {
            onremove(player) {
                player.storage.vl_aak_hy_1 = 0
            },
            mod: {
                maxHandcard(player, num) {
                    return num - player.storage.vl_aak_hy_1;
                },
            },
            mark: true,
            intro: {
                content: "手牌上限-#",
            },
        },
    },
    t: {
        name: "混药",
        info: "当你对一名角色造成伤害后，你可以进行一次判定，判定结果若为：<li>♥：你回复1点体力；<li>♦：你摸两张牌；<li>♣：你弃置其一张牌；<li>♠：直到其下个回合手牌上限–1。",
    },
};
