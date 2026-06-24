import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "醉酒",
        content: "<li>当你使用【杀】时，你移去X层「醉酒」，然后此【杀】伤害+X",
    },
    trigger: {
        player: "useCard1",
    },
    filter(event) {
        return event.card && event.card.name == 'sha';
    },
    charlotte: true,
    forced: true,
    silent: true,
    priority: 3,
    async content(event, trigger, player) {
        const num = player.countVuffNum('zuijiu')
        if (!trigger.baseDamage) trigger.baseDamage = 1;
        trigger.baseDamage += num
        await player.reduceVuff('zuijiu', num)
    },
    vuffInfo: {
        naturalLose: true,
        vuffRank: {
            basic: [1, 0],
            randomPower: 0.2
        },
        type: 'vuff',
    },
};
