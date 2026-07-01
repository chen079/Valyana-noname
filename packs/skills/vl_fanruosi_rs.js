import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBefore",
        player: "enterGame",
    },
    filter(event, player) {
        return event.name != "phase" || game.phaseNumber == 0;
    },
    forced: true,
    async content(event, trigger, player) {
        await player.addVuff("bingyuan", 1, player);
    },
    t: {
        name: "染始",
        info: "锁定技，游戏开始时，你获得1层「病原」。",
    },
};
