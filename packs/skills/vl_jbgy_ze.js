import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    filter(event, player) {
        return player.countMark('vl_jbgy_ze') >= player.hp
    },
    direct: true,
    mark: true,
    init(player, storage) {
        player.setStorage('vl_jbgy_ze', 0)
    },
    intro: {
        content: "本回合已造成$点伤害",
    },
    async content(event, trigger, player) {
        await player.recover()
        if (!game.hasPlayer(function (current) {
            return current.countGainableCards(player, 'ej') > 0;
        })) return;
        const result = await player.chooseTarget('请选择一名角色，获得其装备区或判定区内的一张牌', true, function (card, player, target) {
            return target.countGainableCards(player, 'ej') > 0;
        }).set('ai', function (target) {
            let player = _status.event.player;
            let att = get.attitude(player, target);
            if (att > 0 && target.countCards('ej', function (card) {
                return get.position(card) == 'j' || get.value(card, target) <= 0;
            })) return 2 * att;
            else if (att < 0 && target.countCards('e', function (card) {
                return get.value(card, target) > 5;
            })) return -att;
            return -1;
        }).forResult();
        if (result.bool) {
            let target = result.targets[0];
            player.logSkill('vl_jbgy_ze', target);
            await player.gainPlayerCard(target, 'ej', true);
        }
    },
    group: ["vl_jbgy_ze_damage", "vl_jbgy_ze_count", "vl_jbgy_ze_clean"],
    subSkill: {
        damage: {
            trigger: {
                player: "damageBefore",
            },
            filter(event, player) {
                return event.source && event.source != player
            },
            forced: true,
            async content(event, trigger, player) {
                trigger.source = player
            },
            sub: true,
        },
        count: {
            trigger: {
                source: "damageSource",
            },
            forced: true,
            async content(event, trigger, player) {
                player.addMark('vl_jbgy_ze')
            },
            sub: true,
        },
        clean: {
            trigger: {
                global: "phaseAfter",
            },
            firstDo: true,
            popup: false,
            forced: true,
            async content(event, trigger, player) {
                let num = player.countMark('vl_jbgy_ze')
                player.removeMark('vl_jbgy_ze', num)
            },
            sub: true,
        },
    },
    t: {
        name: "诛恶",
        info: "锁定技，其他角色对你造成伤害前，将伤害来源改为你；回合结束时，若你于本回合内造成的伤害不小于你的体力值，你回复1点体力并获得场上一张牌。",
    },
};
