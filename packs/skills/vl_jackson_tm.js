import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        player: "phaseUseBegin",
    },
    unique: true,
    async content(event, trigger, player) {
        const result = await player.judge().forResult();
        switch (result.color) {
            case 'red':
                await player.recover();
                break;
            case 'black':
                if (player.maxHp > 5) await player.loseMaxHp();
                break;
        }
    },
    t: {
        name: "天命",
        info: "锁定技，出牌阶段开始时，你进行一次判定。若结果为红色，你回复1点体力；若结果为黑色且你的体力上限大于5，你减少1点体力上限。",
    },
};
