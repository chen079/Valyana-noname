import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageAfter",
    },
    forced: true,
    usable: 1,
    filter(event, player) {
        return _status.currentPhase != player && event.num > 0;
    },
    async content(event, trigger, player) {
        player.addVuff('mianyi')
        player.addVuff('bihu')
    },
    ai: {
        maixie: true,
    },
    t: {
        name: "潜鳞",
        info: "当你于回合外受到伤害后，你获得1层「免疫」和「庇护」。",
        taici: ['清辉洗刃，寒意封喉。', '月光所照，皆入我局。'],
    },
};
