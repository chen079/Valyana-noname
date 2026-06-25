import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "phaseBefore",
		player: "enterGame",
	},
	mode: ["identity"],
	available(mode) {
		if (mode == 'identity' && _status.mode == 'purple') return false;
	},
	filter(event, player) {
		return event.name != "phase" || game.phaseNumber == 0;
	},
	unique: true,
	forced: true,
	async content(event, trigger, player) {
		player.addSkill("vl_lucifer_cc_die");
		player.storage.vl_lucifer_cc = game.addPlayer(((player.next.dataset.position == 0) ? (game.players.length) : (player.next.dataset.position)), 'vl_mountainbear').getId();
		player.storage.vl_lucifer_cc.setPosition();
		var target = player.storage.vl_lucifer_cc;
		target.init('vl_mountainbear');
		if (player.identity == 'zhu' || player.identity == 'zhong') {
			target.identity = 'zhong';
			target.setIdentity('zhong');
		} else if (player.identity == 'fan') {
			target.identity = 'fan';
			target.setIdentity('fan');
		} else if (player.identity == 'nei') {
			target.identity = 'nei';
			target.setIdentity('nei');
		}
		player.ai.modAttitudeFrom = (from, to, att) => { //修复内奸摆烂bug
			if (player.isFriendsOf(to)) return get.attitude(from, to);
			return get.attitude(from, to) - 0.1;
		};
		target.ai.modAttitudeFrom = (from, to, att) => {
			if (to == player || player.isFriendsOf(to)) return 114514;
			return get.attitude(player, to) - 0.1;
		};
		target.ai.modAttitudeTo = (from, to, att) => {
			if (from == player || player.isFriendsOf(from)) return 7;
			return get.attitude(from, to); //from,player
		};
		target.update();
		target.storage.vl_lucifer_cc = player;
		target._trueMe = player;
		game.addGlobalSkill('autoswap');
		if (target == game.me) {
			game.notMe = true;
			if (!_status.auto) ui.click.auto();
		}
	},
	subSkill: {
		die: {
			trigger: {
				player: "die",
			},
			forceDie: true,
			direct: true,
			charlotte: true,
			forced: true,
			async content(event, trigger, player) {
				await player.storage.vl_lucifer_cc.die();
			},
		},
	},
	t: {
		name: "传承",
		info: `游戏开始时，你与✡山熊签订“${get.poptip("qiyue")}”于你的下家且与你身份相同（若你为主公，则其身份改为忠臣）。`,
	},
};
