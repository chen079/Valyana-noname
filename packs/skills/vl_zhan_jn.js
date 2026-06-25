import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    mod: {
        maxHandcardBase(player, num) {
						return player.maxHp + player.hujia;
					},
    },
    forced: true,
    async content(event, trigger, player) {
        if (player.maxHp < 10) await player.gainMaxHp();
        if (player.hujia < 5) await player.changeHujia(1, null, true);
    },
    t: {
        name: "聚能",
        info: "锁定技，准备阶段，若你的体力上限小于10，你增加1点体力上限；若你的护甲小于5，你获得1点护甲；你的手牌上限等于你的体力上限与护甲之和。",
    },
};
