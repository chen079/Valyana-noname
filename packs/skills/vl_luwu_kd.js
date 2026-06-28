import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseZhunbeiBegin",
    },
    filter(event, player) {
        return !event.player.isLinked()
    },
    content: async function content(event, trigger, player) {
        await trigger.player.link();
        await player.draw(2);
        player.addTempSkill("vl_luwu_kd_1");
    },
    subSkill: {
        "1": {
            trigger: {
                global: "phaseJieshuBegin",
            },
            direct: true,
            filter(event, player) {
                return game.filterPlayer(current => current.isLinked() && current != player).length > 0 && player.getHistory('damage').length
            },
            async content(event, trigger, player) {
                const targets = game.filterPlayer(current => current.isLinked() && current != player).sortBySeat();
                for (const target of targets) {
                    await target.discardPlayerCard(player, 1, 'he', true);
                }
            },
        },
    },
    t: {
        name: "困斗",
        info: "一名角色的准备阶段，若其未横置，则你可以横置其并摸两张牌，本回合的结束阶段，若你此回合受到过伤害，其他横置角色依次弃置你一张牌。",
        taici: ['寇至门前，刀已出鞘。', '犯我疆界者，留下名字。'],
    },
};
