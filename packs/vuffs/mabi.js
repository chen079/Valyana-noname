import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "麻痹",
        content: "<li>你不能响应其他角色对你使用的牌；你使用♣牌时，移除一层「<font color=red>麻痹</font>」。",
    },
    charlotte: true,
    trigger: {
        player: "useCard",
        global: "useCardToPlayered",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("mabi")
    },
    async content(event, trigger, player) {
        if (trigger.name == 'useCard') {
            if (trigger.card.suit == 'club') await player.reduceVuff('mabi');
        }
        else {
            if (trigger.player != player && trigger.target == player) {
                game.log(player, '受「<font color=red>麻痹</font>」影响');
                game.log(player, '无法响应', trigger.card);
                trigger.getParent().directHit.add(trigger.target);
            }
        }
    },
    vuffInfo: {
        naturalLose: false,
        type: 'devuff',
        vuffRank: {
            basic: [0, 1.5],
        },
        vuffReject: ['mingjie'],
    }
};
