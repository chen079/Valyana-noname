import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    forced: true,
    filter(event, player) {
        return event.card && event.card.name == 'sha' && _status.currentPhase == player;
    },
    async content(event, trigger, player) {
        player.getStat().card.sha--;
    },
    t: {
        name: "枪雨",
        info: "当你的【杀】造成伤害后，本回合出杀次数+1。",
    },
};
