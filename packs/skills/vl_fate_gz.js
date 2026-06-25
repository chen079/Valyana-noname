import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
        const result = await player.draw(2);
        await player.addShownCards(result);
    },
    t: {
        name: "vl_fate_gz",
        info: "",
    },
};
