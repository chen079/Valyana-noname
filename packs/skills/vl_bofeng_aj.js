import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    direct: true,
    shaRelated: true,
    filter(event, player) {
        return event.card.name == 'sha' && event.target.countCards('h') > 0;
    },
    async content(event, trigger, player) {
        const handResult = await player.choosePlayerCard('h', trigger.target).forResult();
        if (!handResult.bool || !handResult.cards || !handResult.cards.length) return;
        player.addTempSkill("vl_xieji", { player: "phaseEnd" })
        const expansion = player.addToExpansion(handResult.cards, 'gain2');
        expansion.gaintag.add('vl_xieji');
        await expansion;
        const max = Math.min(trigger.target.hp - 1, trigger.target.countCards('he'));
        if (max <= 0) return;
        let next = player.choosePlayerCard(trigger.target, 'he', [1, max], get.prompt('vl_bofeng_aj', trigger.target))
            .set('prompt2', '将目标角色至多' + max + '张牌置于其武将牌上');
        next.set('ai', function (button) {
            if (!_status.event.goon) return 0;
            let val = get.value(button.link);
            if (button.link == _status.event.target.getEquip(2)) return 2 * (val + 3);
            return val;
        });
        next.set('goon', get.attitude(player, trigger.target) <= 0);
        next.set('forceAuto', true);
        const result = await next.forResult();
        if (result.bool) {
            let target = trigger.target;
            player.logSkill('vl_bofeng_aj', target);
            target.addSkill('vl_bofeng_aj_2');
            const expansion = target.addToExpansion('giveAuto', result.cards, target);
            expansion.gaintag.add('vl_bofeng_aj_2');
            await expansion;
        }
    },
    subSkill: {
        "2": {
            trigger: {
                global: "phaseEnd",
            },
            forced: true,
            popup: false,
            charlotte: true,
            filter(event, player) {
                return player.getExpansions('vl_bofeng_aj_2').length > 0;
            },
            async content(event, trigger, player) {
                let cards = player.getExpansions('vl_bofeng_aj_2');
                await player.gain(cards, 'draw');
                game.log(player, '收回了' + get.cnNumber(cards.length) + '张“玄技”牌');
                player.removeSkill('vl_bofeng_aj_2');
            },
            intro: {
                markcount: "expansion",
                mark(dialog, storage, player) {
                    let cards = player.getExpansions('repojun2');
                    if (player.isUnderControl(true)) dialog.addAuto(cards);
                    else return '共有' + get.cnNumber(cards.length) + '张牌';
                },
            },
            sub: true,
        },
    },
    t: {
        name: "玄技",
        info: "当你使用【杀】指定目标后，你可以将目标角色的一张手牌置于你的武将牌上，称为“协”，然后你将其的至多X-1张牌置于其武将牌上（X为其体力值），其于当前回合结束时获得这些牌。",
        taici: ["剑先取势，再断其心。", "牌与刃，都由我来裁。"],
    },
};
