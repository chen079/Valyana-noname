import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

function isSingleTargetCard(card) {
    const info = get.info(card);
    if (!info || info.notarget) return false;
    if (get.type(card) == 'equip') return false;
    if (info.toself || info.singleCard) return true;
    if (!info.selectTarget) return true;
    if (info.selectTarget == 1) return true;
    return Array.isArray(info.selectTarget) && info.selectTarget[0] == 1 && info.selectTarget[1] == 1;
}

export default {
    trigger: {
        player: "damageEnd",
    },
    direct: true,
    filter(event, player) {
        return player.countCards('hs', function (card) {
            return isSingleTargetCard(card) && player.hasUseTarget(card);
        }) > 0;
    },
    async content(event, trigger, player) {
        player.storage.vl_boss_hars_sj_damage = false;
        player.addTempSkill('vl_boss_hars_sj_check');
        const result = await player.chooseToUse(function (card, player, event) {
            const evt = event || _status.event;
            return isSingleTargetCard(card) && lib.filter.filterCard(card, player, evt);
        }, get.prompt('vl_boss_hars_sj') + '：使用一张单目标牌').set('ai1', function (card) {
            if (get.tag(card, 'damage')) return 9 - get.value(card);
            return 5 - get.value(card);
        }).forResult();
        player.removeSkill('vl_boss_hars_sj_check');
        if (!result.bool || !player.storage.vl_boss_hars_sj_damage) return;
        player.logSkill('vl_boss_hars_sj');
        const targets = game.filterPlayer(current => current != player && current.countCards('h') > 0);
        for (const target of targets) {
            await player.viewHandcards(target);
        }
        delete player.storage.vl_boss_hars_sj_damage;
        player.insertPhase();
    },
    ai: {
        maixie: true,
        maixie_hp: true,
        threaten: 3.5,
        effect: {
            target(card, player, target) {
                if (player.hasSkillTag('jueqing', false, target)) return;
                if (get.tag(card, 'damage') && target.countCards('hs') > 0) return [1, 0.45];
            },
        },
    },
    group: "vl_boss_hars_sj_turn",
    subSkill: {
        turn: {
            trigger: {
                global: "phaseEnd",
            },
            forced: true,
            filter(event, player) {
                return game.hasPlayer(current => current.countCards('h') == 0) && game.hasPlayer(current => current != player && current.countCards('h') > 0);
            },
            async content(event, trigger, player) {
                const targets = game.filterPlayer(current => current != player && current.countCards('h') > 0).sortBySeat();
                player.line(targets, 'thunder');
                for (const target of targets) {
                    await target.turnOver();
                }
            },
            sub: true,
        },
        check: {
            trigger: {
                source: "damageEnd",
            },
            forced: true,
            silent: true,
            popup: false,
            charlotte: true,
            async content(event, trigger, player) {
                player.storage.vl_boss_hars_sj_damage = true;
            },
            sub: true,
        },
    },
    t: {
        name: "神降",
        info: "每回合结束时，若有角色没有手牌，其他角色须翻面。你受到伤害后，可以使用一张单目标牌，若造成伤害则观看其他角色的手牌并获得一个额外回合。",
    },
};
