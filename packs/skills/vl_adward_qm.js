import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["phaseUseBegin", "phaseJieshuBegin"],
    },
    direct: true,
    filter(event, player) {
        const str = event.name == 'phaseUse' ? 'red' : 'black';
        return player.countCards('h', { color: str }) > 0
    },
    async content(event, trigger, player) {
        const color = trigger.name == 'phaseUse' ? 'red' : 'black';
        while (player.countCards('h', { color }) > 0) {
            const cards = player.getCards('h').filter(card => get.color(card) == color);
            if (!cards.length) return;
            player.logSkill("vl_adward_qm");
            await player.recast(cards);
        }
    },
    t: {
        name: "千面",
        info: "出牌阶段开始时，你重铸手牌中的所有红色牌，直至没有红色牌；结束阶段，你重铸你手牌中的所有黑色牌，直至没有黑色牌。",
    },
};
