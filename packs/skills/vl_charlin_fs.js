import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filterTarget(card, player, target) {
		return player.canCompare(target)
	},
	selectTarget() {
		let player = _status.event.player
		return [1, player.hp]
	},
	filter(event, player) {
		return player.countCards('h') > 0;
	},
	multitarget: true,
	multiline: true,
	content: async function content(event, trigger, player) {
		const targets = event.targets;
		const result = await player.chooseToCompare(targets).forResult();
		for (let i = 0; i < targets.length; i++) {
			if (result.num1[i] > result.num2[i]) {
				await player.draw();
				targets[i].addVuff('shisheng', 2);
			}
		}
	},
	t: {
		name: "服说",
		info: "出牌阶段限一次，你可以用一张手牌与至多X名角色同时拼点（X为你的体力值），若你赢，你摸一张牌并令该角色获得2层「失声」。",
	},
};
