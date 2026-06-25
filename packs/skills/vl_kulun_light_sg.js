import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterCard: true,
    position: "he",
    usable: 1,
    check(card) {
					return 9 - get.value(card)
				},
    filter(event, player) {
					return player.countCards('he') > 0
				},
    filterTarget(card, player, target) {
					return player != target
				},
    async content(event, trigger, player) {
var buffs = game.findVuff('type', 'buff')
        					player.addVuff(buffs.randomGet())
        					target.addVuff(buffs.randomGet())
        					await target.recover()
    },
    ai: {
        order: 9,
        result: {
            target: 2,
        },
        threaten: 2,
        expose: 0.2,
    },
    _priority: 0,
    t: {
        name: "圣光",
        info: "出牌阶段，你可以弃置一张牌，令一名其他角色与你获得1层随机正面buff，然后其回复1点体力。",
    },
};
