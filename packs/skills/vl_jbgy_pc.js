import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBefore",
        player: "enterGame",
    },
    forced: true,
    filter(event, player) {
        return event.name != 'phase' || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
        game.countPlayer(function (current) {
            if (current != player) current.addSkill('vl_jbgy_pc_1');
        });
        game.log(player, '令除其以外的所有其他角色手牌均可见')
        await game.delayx();
    },
    subSkill: {
        "1": {
            mark: true,
            intro: {
                mark(dialog, content, player) {
                    var cards = player.getCards('h')
                    if (cards && cards.length) {
                        dialog.addAuto(cards);
                    }
                },
            },
            content(content, player) {
                var cards = player.getCards('h')
                if (cards && cards.length) {
                    return get.translation(cards);
                }
            },
            sub: true,
        },
    },
    t: {
        name: "迫察",
        info: "锁定技，除你以外，其他所有角色的手牌对所有人可见。",
    },
};
