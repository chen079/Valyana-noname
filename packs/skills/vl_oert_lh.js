import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        player: "phaseEnd",
    },
    async content(event, trigger, player) {
        const result = await player.judge().forResult();
        switch (result.color) {
            case 'red':
                player.insertPhase();
                break;
            case 'black':
                await player.draw(2);
                break;
        }
    },
    t: {
        name: "轮回",
        info: "锁定技，你的回合结束阶段，进行一次判定，若结果为红色，则你进行一个额外的回合；若结果为黑色，你摸两张牌。",
    },
};
