import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
					return player.countCards('h') >= 1;
				},
    filterTarget(card, player, target) {
					return target != player;
				},
    filterCard: true,
    selectCard: -1,
    discard: false,
    prepare: "give",
    content: async function content(event, trigger, player) {
					await event.targets[0].gain(cards);
					if (!player.hujia) {
						await player.changeHujia(1,null,true);
					} else {
						await player.draw(2);
					}
				},
    ai: {
        threaten: 1.5,
        order: 2.1,
        result: {
            target(player, target) {
							if (target.hasSkillTag('nogain')) return 0;
							if (get.attitude(player, target) < 3) return 0;
							if (target.hasJudge('lebu')) return 0;
							if (target.hp == target.maxHp) return 0.1
							return 1;
						},
        },
    },
    t: {
        name: "韵生",
        info: "出牌阶段限一次，你可以将你的全部手牌（至少一张）交给一名其他角色，然后若你没有护甲，你获得1点护甲，否则，你摸两张牌。",
    },
};
