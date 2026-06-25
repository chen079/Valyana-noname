import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    check(event, player) {
        return player.hp > 2 && event.player.hp > event.num && !event.player.hasSkillTag('filterDamage', null, {
            player: player,
            card: event.card,
        }) && get.attitude(player, event.player) < 0;
    },
    filter(event, player) {
        return event.player != player
    },
    async content(event, trigger, player) {
        await player.loseHp();
        trigger.num = trigger.num * 2;
    },
    group: "vl_mala_sz_1",
    subSkill: {
        "1": {
            trigger: {
                player: "damageEnd",
            },
            forced: true,
            async content(event, trigger, player) {
                var evt = _status.event.getParent('phaseUse');
                if (evt && evt.name == 'phaseUse') {
                    evt.skipped = true;
                }
                var evt = _status.event.getParent('phase');
                if (evt && evt.name == 'phase') {
                    evt.finish();
                }
            },
            ai: {
                jueqing: true,
            },
            sub: true,
        },
    },
    t: {
        name: "斩击",
        info: "锁定技，当你造成伤害时，你可以失去1点体力，令此伤害翻倍；当你受到伤害后，你结束当前回合。",
    },
};
