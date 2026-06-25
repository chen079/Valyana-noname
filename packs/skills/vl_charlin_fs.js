import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
					return player.canCompare(target)
				},
    selectTarget() {
					var player = _status.event.player
					return [1, player.hp]
				},
    filter(event, player) {
					return player.countCards('h') > 0;
				},
    multitarget: true,
    multiline: true,
    content: async function content(event, trigger, player) {
					player.chooseToCompare(targets).callback = async (event, trigger, player) =>{
						if (event.num1 > event.num2) {
							await player.draw();
							target.addVuff('shisheng', 2);
						}
					}
				},
    t: {
        name: "服说",
        info: "出牌阶段限一次，你可以用一张手牌与至多X名角色同时拼点（X为你的体力值），若你赢，你摸一张牌并令该角色获得2层「失声」。",
    },
};
