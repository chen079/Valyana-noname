import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "die",
    },
    forceDie: true,
    forced: true,
    skillAnimation: true,
    animationColor: "orange",
    init(player) {
        if (!player.storage.vl_bladewolf_rh) player.storage.vl_bladewolf_rh = 0
    },
    mark: true,
    intro: {
        content: "当前累计受到了$点伤害",
    },
    async content(event, trigger, player) {
        while (player.storage.vl_bladewolf_rh > 0) {
            const targetResult = await player.chooseTarget(1, '请选择你要分配伤害的目标，你目前可以分配' + player.storage.vl_bladewolf_rh + '点伤害', function (card, player, target) {
                return target != player;
            }).set('ai', function (target) {
                const player = _status.event.player;
                return get.damageEffect(target, null, player, player, 'fire');
            }).set('forceDie', true).forResult();
            if (!targetResult.bool) return;
            const target = targetResult.targets[0];
            const numberResult = await player.chooseNumbers(get.prompt2('vl_bladewolf_rh'), [{ prompt: '请选择数量', min: 1, max: player.storage.vl_bladewolf_rh }])
                .set("processAI", function () {
                    const player = _status.event.player;
                    if (target.isUnknown()) return [1];
                    return [Math.min(target.hp, player.storage.vl_bladewolf_rh)];
                })
                .set('forceDie', true)
                .forResult();
            if (!numberResult.bool) return;
            const num = numberResult.numbers[0];
            await target.damage(num, player, 'fire');
            player.storage.vl_bladewolf_rh -= num;
        }
    },
    group: "vl_bladewolf_rh_count",
    subSkill: {
        count: {
            charlotte: true,
            forced: true,
            trigger: {
                player: "damageBegin4",
            },
            async content(event, trigger, player) {
                player.storage.vl_bladewolf_rh += trigger.num
            },
        },
    },
    t: {
        name: "融毁",
        info: "锁定技，①当你受到伤害时，你获得等于此次伤害值的“融毁”标记。②当你死亡时，你可以移去任意数量的“融毁”标记并对一名其他角色造成等量的火焰伤害，然后若你有“融毁”标记，你可以重复此流程。",
    },
};
