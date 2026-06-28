import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "dying",
	},
	limited: true,
	skillAnimation: true,
	animationColor: "wood",
	filter(event, player) {
		return player.hp < 1;
	},
	check(event, player) {
		return true;
	},
	async content(event, trigger, player) {
		player.awakenSkill('vl_azao_guishi');
		await player.recoverTo(1);
		player.setStorage('vl_azao_huxi_hand', true);
		const cards = player.getExpansions('vl_azao_huxi');
		if (cards.length) await player.gain(cards, 'gain2').gaintag.add('vl_azao_huxi_hand');
		player.addSkillLog('vl_azao_qihui');
		player.when({ global: 'phaseAfter' }).then(() => {
			player.insertPhase();
		});
	},
	mark: true,
	intro: {
		content: "limited",
	},
	init(player, skill) {
		player.setStorage(skill, false);
	},
	derivation: "vl_azao_qihui",
	t: {
		name: "归誓",
		info: "限定技，当你进入濒死状态时，你可以将体力值回复至1点。若如此做，将〖护契〗中的“置于你的武将牌上”改为“放入手牌”。然后你获得所有的“护”，并获得〖契辉〗。本回合结束时，你立刻执行一个额外的回合。",
	},
};
