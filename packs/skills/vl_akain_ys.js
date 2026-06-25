import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageEnd",
    },
    usable: 1,
    filter(event, player) {
        return player.group != 'wei' && event.player.group == player.group
    },
    async content(event, trigger, player) {
        player.changeGroup('wei')
        if (trigger.player == player) {
            return
        }
        const result = await player.chooseBool('是否视为对' + get.translation(trigger.player) + '使用一张【杀】').forResult();
        if (result.bool) {
            await player.useCard({ name: 'sha' }, trigger.player, false);
        }
    },
    group: "vl_akain_ys_fire",
    subSkill: {
        fire: {
            trigger: {
                source: ["damageBefore"],
            },
            direct: true,
            filter(event, player) {
                return player.group != 'wei'
            },
            async content(event, trigger, player) {
                game.setNature(trigger, 'fire');
            },
        },
    },
    t: {
        name: "炎势",
        info: "非魏势力技，你造成的伤害视为火属性。每回合限一次，一名角色对你的同势力角色造成伤害后，你可以变更势力为魏，若受伤角色不为你，你可以视为对受伤角色使用一张【杀】。",
    },
};
