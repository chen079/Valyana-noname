import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	unique: true,
	trigger: {
		player: "dying",
	},
	mark: true,
	skillAnimation: true,
	limited: true,
	animationColor: "orange",
	init(player) {
		player.setStorage('vl_froh_sn', false);
	},
	filter(event, player) {
		if (player.getStorage('vl_froh_sn', false)) return false;
		return true;
	},
	async content(event, trigger, player) {
		player.awakenSkill('vl_froh_sn');
		player.setStorage('vl_froh_sn', true);
		await player.discard(player.getCards('hej'));
		player.link(false);
		await player.turnOver(false);
		await player.gainMaxHp()
		await player.drawTo(player.maxHp);
		await player.recover(player.maxHp - player.hp);
		player.changeHubian();
		if (!player.getStorage('hubian', false)) {
			player.changeSkin({ characterName: player.name }, player.name)
		} else {
			player.changeSkin({ characterName: player.name }, player.name + '2')
		}
	},
	ai: {
		order: 1,
		skillTagFilter(player, arg, target) {
			if (player != target || player.getStorage('vl_froh_sn', false)) return false;
		},
		save: true,
		result: {
			player(player) {
				if (player.hp <= 0) return 10;
				if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
				return 0;
			},
		},
		threaten(player, target) {
			if (!target.getStorage('vl_froh_sn', false)) return 0.6;
		},
	},
	intro: {
		content: "limited",
	},
	t: {
		name: "释能",
		info: `限定技，当你进入濒死状态时，你可以获得1点体力上限、复原武将牌并弃置你区域内的所有牌，然后将你的体力值和手牌数调整至体力上限。若如此做，你改变你的${get.poptip("hubian")}状态。`,
        taici: ['神谕落笔，万灵肃听。', '此页之后，众生改道。'],
    },
};
