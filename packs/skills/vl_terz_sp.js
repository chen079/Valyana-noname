import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseBefore",
		player: "enterGame",
	},
	forced: true,
	filter(event, player) {
		return event.name != 'phase' || game.phaseNumber == 0;
	},
	derivation: "vl_terz_ly",
	logTarget: () => game.filterPlayer().sortBySeat(),
	async content(event, trigger, player) {
		game.countPlayer(function (current) {
			current.addSkill('vl_terz_ly');
			current.markSkill('vl_terz_ly_mark')
		});
		game.log(player, '令所有其他角色获得了技能', `#g${get.poptip("vl_terz_ly")}`)
		await game.delayx();
		const result = await player.chooseTarget(`是否减1点体力上限，并令一名其他角色获得技能${get.poptip("vl_terz_fz")}？`, lib.filter.notMe).set('ai', function (target) {
			const player = _status.event.player;
			if (player.hasUnknown() && !target.isZhu) return 0;
			if (player.getEnemies().includes(target)) return 0;
			return get.attitude(player, target);
		}).forResult();
		if (result.bool) {
			await player.loseMaxHp();
			const target = result.targets[0];
			player.line(target, 'fire');
			target.addSkillLog('vl_terz_fz');
			await game.delayx();
		}
	},
	t: {
		name: "审判",
		info: `锁定技。游戏开始时，你令所有角色获得${get.poptip("vl_terz_ly")}。然后你可减1点体力上限，令一名其他角色获得${get.poptip("vl_terz_fz")}。`,
	},
};
