import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    unique: true,
    frequent: true,
    firstDo: true,
    async content(event, trigger, player) {
        for (let count = trigger.num; count > 0; count--) {
            const result = await player.judge().forResult();
            switch (result.color) {
                case 'red': await player.recover(); break;
                case 'black': await player.draw(2); break;
            }
        }
    },
    ai: {
        maixie: true,
        maixie_hp: true,
    },
    t: {
        name: "缓释",
        info: "当你受到1点伤害后，你可以进行一次判定，若结果为红色，你回复1点体力，若为黑色，你摸两张牌。",
    },
};
