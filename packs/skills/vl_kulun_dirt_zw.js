import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	frequent: true,
	async content(event, trigger, player) {
		const cards = [];
		const suits = [];
		while (true) {
			const judge = await player.judge(function (result) {
				if (suits.includes(get.suit(result))) return 0;
				return 1;
			}).forResult();
			if (!judge.bool) break;
			cards.push(judge.card);
			suits.push(judge.suit);
			const again = await player.chooseBool('是否继续发动【载物】？').set('frequentSkill', 'vl_kulun_dirt_zw').forResult();
			if (!again.bool) break;
		}
		const gains = cards.filterInD();
		if (!gains.length) return;
		const result = await player.chooseTarget('将' + get.translation(gains) + '交给一名角色', true).set('ai', function (target) {
			let player = _status.event.player;
			let att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
			if (target.hasSkillTag('nogain')) att /= 10;
			return att;
		}).forResult();
		if (!result.bool) return;
		let target = result.targets[0];
		event.target = target;
		player.line(target, 'green');
		await target.gain(gains, 'gain2').set('giver', player);
	},
	ai: {
		order: 9,
		result: {
			player: 1,
		},
	},
	_priority: 0,
	t: {
		name: "载物",
		info: "出牌阶段限一次。你可进行判定。若判定结果与本次发动技能时的其他判定结果的花色均不相同，则你可以重复此流程。然后你将这些判定牌交给一名角色。",
	},
};
