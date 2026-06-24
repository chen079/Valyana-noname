import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    trigger: {
        global: "damageBegin1",
    },
    t: {
        name: '茂放',
        info: '其他角色造成伤害时，你可以弃置至多X张牌，令此伤害+X（X为你已损体力值）。'
    },
    filter(event, player) {
        return event.source != player && player.hp < player.maxHp && player.countCards('h') > 0;
    },
    async cost(event, trigger, player) {
        event.result = await player.chooseToDiscard('h', get.prompt2('vl_maofang', trigger.player), [1, player.maxHp - player.hp]).set('ai', (card) => {
            let attr = get.attitude(player, trigger.player);
            if (player.hp > 1) return 7 + attr - get.value(card);
            return 7 - get.value(card)
        }).set("chooseonly", true).forResult()
    },
    async content(event, trigger, player) {
        const cards2 = event.cards
        await player.discard(cards2)
        trigger.num += cards2.length;
    }
}