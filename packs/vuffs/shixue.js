import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "嗜血",
        content: "<li>你造成伤害后，回复1点体力；你回复体力后，移除一层「<font color=red>嗜血</font>」。",
    },
    charlotte: true,
    trigger: {
        source: "damageAfter",
        player: "recoverAfter",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff("shixue")
    },
    async content(event, trigger, player) {
        const onrewrite = event.triggername;
        if (onrewrite == 'damageAfter') {
            if (player.getDamagedHp() > 0) {
                game.log(player, '受「<font color=red>嗜血</font>」影响');
                await player.recover();
            }
        } else {
            await player.reduceVuff('shixue')
        }
    },
    vuffInfo: {
        naturalLose: false,
        type: 'vuff',
        limit: 4,
        vuffRank: {
            basic: [2, 0],
        },
    }
};
