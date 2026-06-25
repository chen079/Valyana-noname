import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: ["gainAfter", "loseAfter", "useSkillAfter"],
		global: "gameDrawEnd",
	},
	forced: true,
	popup: false,
	init(player) {
		if (game.online) return;
		player.removeAdditionalSkill('vl_baixi_dy');
		const list = [];
		if (player.countCards('h', { color: 'red' }) > player.countCards('h', { color: 'black' })) {
			list.push('bazhen', 'jijiu');
		}
		if (player.countCards('h', { color: 'red' }) < player.countCards('h', { color: 'black' })) {
			list.push('rewansha', 'vl_baixi_jc')
		}
		if (player.countCards('h', { color: 'red' }) == player.countCards('h', { color: 'black' })) {
			list.push('reenyuan')
		}
		if (list.length) {
			player.addAdditionalSkill('vl_baixi_dy', list);
		}
	},
	derivation: ["bazhen", "jijiu", "rewansha", "vl_baixi_jc", "reenyuan"],
	async content(event, trigger, player) {
		player.removeAdditionalSkill('vl_baixi_dy');
		const list = [];
		if (player.countCards('h', { color: 'red' }) > player.countCards('h', { color: 'black' })) {
			list.push('bazhen', 'jijiu');
		}
		if (player.countCards('h', { color: 'red' }) < player.countCards('h', { color: 'black' })) {
			list.push('rewansha', 'vl_baixi_jc')
		}
		if (player.countCards('h', { color: 'red' }) == player.countCards('h', { color: 'black' })) {
			list.push('reenyuan')
		}
		if (list.length) {
			player.addAdditionalSkill('vl_baixi_dy', list);
		}
	},
	t: {
		name: "德怨",
		info: `锁定技，若你的红色手牌数量大于黑色，则你拥有${get.poptip("bazhen")}、${get.poptip("jijiu")}。若小于则你拥有${get.poptip("rewansha")}、${get.poptip("vl_baixi_jc")}。若等于，则你拥有${get.poptip("reenyuan")}。`,
	},
};
