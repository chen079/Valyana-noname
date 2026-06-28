import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: "vl_chen_ly_double",
    trigger: {
        player: "useCardToPlayered",
    },
    priority: 5,
    direct: true,
    shaRelated: true,
    filter(event, player) {
        return event.card.name == 'sha';
    },
    async content(event, trigger, player) {
        const distance = get.distance(player, trigger.target);
        if (distance > 1) {
            const result = await player.chooseBool(get.prompt('vl_chen_ly', trigger.target), '摸一张牌；若你本回合未造成过伤害，可以令此【杀】无视防具且不可被响应。').set('ai', function () {
                const player = _status.event.player;
                const target = _status.event.getTrigger().target;
                return get.effect(target, _status.event.getTrigger().card, player, player) > 0 || player.getHistory('sourceDamage').length == 0;
            }).set('frequent', true).forResult();
            if (!result.bool) return;
            player.logSkill('vl_chen_ly', trigger.target);
            await player.draw();
            if (player.getHistory('sourceDamage').length == 0) {
                trigger.target.addTempSkill('qinggang2');
                trigger.target.storage.qinggang2.add(trigger.card);
                trigger.getParent().directHit.add(trigger.target);
            }
        }
        else if (distance == 1) {
            const result = await player.chooseBool(get.prompt('vl_chen_ly', trigger.target), '令此【杀】对其造成的伤害+1。').set('ai', function () {
                const player = _status.event.player;
                const target = _status.event.getTrigger().target;
                return get.damageEffect(target, player, player) > 0;
            }).forResult();
            if (!result.bool) return;
            player.logSkill('vl_chen_ly', trigger.target);
            const id = trigger.target.playerid;
            const customArgs = trigger.customArgs;
            if (!customArgs[id]) customArgs[id] = {};
            if (!customArgs[id].extraDamage) customArgs[id].extraDamage = 0;
            customArgs[id].extraDamage++;
        }
    },
    subSkill: {
        double: {
            trigger: {
                player: "useCard",
            },
            direct: true,
            filter(event, player) {
                return event.card.name == 'sha' && player.countCards('e', { subtype: 'equip1' }) > 0;
            },
            async content(event, trigger, player) {
                const result = await player.chooseBool(get.prompt('vl_chen_ly'), '令此【杀】额外结算一次。').set('ai', function () {
                    const trigger = _status.event.getTrigger();
                    const player = _status.event.player;
                    if (!trigger.targets || !trigger.targets.length) return false;
                    return trigger.targets.some(target => get.effect(target, trigger.card, player, player) > 0);
                }).forResult();
                if (!result.bool) return;
                player.logSkill('vl_chen_ly');
                trigger.effectCount++;
                game.log(trigger.card, '额外结算一次');
            },
            sub: true,
        },
    },
    ai: {
        directHit_ai: true,
        unequip_ai: true,
        skillTagFilter(player, tag, arg) {
            if (!arg || (arg.name != 'sha' && arg.card?.name != 'sha')) return false;
            if (tag == 'directHit_ai') return player.getHistory('sourceDamage').length == 0;
            if (tag == 'unequip_ai') return player.getHistory('sourceDamage').length == 0;
        },
    },
    t: {
        name: "落羽",
        info: "当你使用【杀】指定距离大于1的角色为目标时，你可以摸一张牌；若你本回合未造成过伤害，你可以令此【杀】无视防具且不可被响应。当你使用【杀】指定距离为1的角色为目标时，你可令此【杀】造成的伤害+1。若你的装备区内有武器牌，你可令【杀】额外结算一次。",
        taici: ['龙影破云，雷霆随我。', '仰望吧，天穹已被我点亮。'],
    },
};
