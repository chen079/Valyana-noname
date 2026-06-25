import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageEnd",
    },
    check(event, player) {
        var att1 = get.attitude(player, event.player);
        var att2 = get.attitude(player, event.source)
        return att2 < 0 && att1 > 0
    },
    mark: true,
    intro: {
        content: "本回合已对$发动过本技能",
    },
    filter(event, player) {
        return event.cards && event.source != player && event.source && get.distance(player, event.player) <= 1 && event.player.isIn() && !player.storage.vl_whitewolf_wl.includes(event.player)
    },
    content: async function content(event, trigger, player) {
        if (!player.storage.vl_whitewolf_wl) player.storage.vl_whitewolf_wl = []
        await trigger.source.gain(trigger.cards, 'gain2');
        player.storage.vl_whitewolf_wl.push(trigger.player)
        if (!player.canUse({ name: 'sha', isCard: true }, trigger.source)) return;
        const { card } = await player.useCard({ name: 'sha', isCard: true }, trigger.source, false).forResult();
        if (player.getHistory('sourceDamage', function (evt) {
            return card == evt.card;
        }).length) {
            await trigger.player.recover(trigger.num)
        }
    },
    group: "vl_whitewolf_wl_clean",
    subSkill: {
        clean: {
            trigger: {
                global: "phaseEnd",
            },
            popup: false,
            forced: true,
            async content(event, trigger, player) {
                player.storage.vl_whitewolf_wl = []
            },
        },
    },
    t: {
        name: "巍立",
        info: "每回合每名角色限一次，当与你距离不大于1的角色受到其他角色造成的伤害后，你可以令伤害来源获得造成伤害的牌，然后视为对伤害来源使用一张无距离限制的【杀】；若此【杀】造成了伤害，你令受伤角色回复X点体力（X为伤害来源此次造成的伤害值）。",
    },
};
