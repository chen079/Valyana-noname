import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "dying",
	},
	juexingji: true,
	forced: true,
	mark: true,
	skillAnimation: true,
	animationColor: "thunder",
	unique: true,
	logTarget(event, player) {
		return game.filterPlayer(function (current) {
			return current != player
		})
	},
	content: async function content(event, trigger, player) {
		player.awakenSkill('vl_qima_jm');
		await player.recover(2 - player.hp);
		for (let current of game.filterPlayer()) {
			if (current == player) continue;
			let skills = current.skills;
			for (let i of skills) {
				current.removeSkill(i)
				current.unmarkSkill(i)
			}
			current.skills = []
			if (current.maxHp > 4) await current.loseMaxHp(current.maxHp - 4);
			else if (current.maxHp > 4) await current.gainMaxHp(4 - current.maxHp);
			if (current.hujia) await current.changeHujia(-current.hujia);
			current.update()
		}
	},
	t: {
		name: "俱灭",
		info: "觉醒技，当你进入濒死状态时，你将体力值回复至2点，然后令所有其他角色失技能与护甲，并将这些角色的体力上限调整为4。",
	},
};
