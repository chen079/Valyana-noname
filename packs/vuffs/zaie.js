import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "灾厄",
        content: "<li>你的判定会朝着对你不利的方向倾斜。<li>判定完成后，移除一层「<font color=purple>灾厄</font>」。",
    },
    charlotte: true,
    trigger: {
        player: "judgeBegin",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player) {
        return player.hasVuff('zaie') && !event.directresult;
    },
    async content(event, trigger, player) {
        let tempcard = false, temp = -Infinity;
        for (let i = 0; i < ui.cardPile.childElementCount; i++) {
            const card = ui.cardPile.childNodes[i];
            const temp2 = trigger.judge(card);
            if (temp2 < temp) {
                tempcard = card;
                temp = temp2;
            }
        }
        if (tempcard) trigger.directresult = tempcard;
        await player.reduceVuff('zaie')
    },
    ai: {
        luckyStar: false,
        BadLuck: true,
    },
    vuffInfo: {
        naturalLose: true,
        type: 'devuff',
        vuffRank: {
            basic: [0, 0.5],
            random: [0, 0.3],
            randomPower: 2
        },
        limit: 3,
        vuffReject: ['qiyuan']
    }
};
