import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "shaBegin",
	},
	direct: true,
	priority: 11,
	filter(event, player) {
		if (player.hasSkill('vl_telina_hs_4')) return false;
		if (event.target.isUnderControl()) return false;
		return event.target != player && event.target.countCards('h') > 0;
	},
	group: ["vl_telina_hs_2", "vl_telina_hs_3"],
	async content(event, trigger, player) {
		if (event.isMine()) {
			event.dialog = ui.create.dialog('慧眼：猜测' + get.translation(trigger.player) + '对' + get.translation(trigger.target) + '的【杀】能否命中');
		}
		const result = await player.chooseControl('能命中', '不能命中', 'cancel').set('ai', function (event) {
			if (trigger.player.hasSkill('wushuang')) return 0;
			if (trigger.player.hasSkill('liegong')) return 0;
			if (trigger.player.hasSkill('tieji')) return 0;
			if (trigger.player.hasSkill('juji')) return 0;
			if (trigger.player.hasSkill('retieji')) return 0;
			if (trigger.player.hasSkill('roulin') && trigger.target.sex == 'female') return 0;
			if (trigger.player.hasSkill('nvquan') && trigger.target.sex == 'male') return 0;
			if (trigger.target.hasSkill('yijue2')) return 0;
			if (trigger.target.hasSkill('shejie2')) return 0;
			if (trigger.target.hasSkill('shanguang2')) return 0;
			if (trigger.directHit) return 0

			const equip = trigger.target.getEquip(2);
			if (equip && equip.name == 'bagua') return 1;
			return trigger.target.countCards('h') < 2 ? 0 : 1;
		}).forResult();
		if (event.dialog) {
			event.dialog.close();
		}
		if (result.control != 'cancel') {
			player.addTempSkill('vl_telina_hs_4', "shaAfter");
			player.logSkill(['vl_telina_hs', result.control], trigger.target);
			game.log(player, '猜测' + result.control);
			player.setStorage('vl_telina_hs', result.control);
			await game.delay();
		}
	},
	subSkill: {
		"2": {
			trigger: {
				global: "shaEnd",
			},
			forced: true,
			popup: false,
			filter(event, player) {
				return player.getStorage('vl_telina_hs', false) ? true : false;
			},
			async content(event, trigger, player) {
				if (player.getStorage('vl_telina_hs', false) == '不能命中') {
					player.popup('猜测成功');
					player.draw(2);
					player.setStorage('vl_telina_th', player.getStorage('vl_telina_th', 0) + 1)
				}
				else {
					player.popup('猜测失败');
					player.chooseToDiscard('猜测失败，请弃置一张牌', 'he', true);
				}
				player.setStorage('vl_telina_hs', false);
			},
			sub: true,
		},
		"3": {
			trigger: {
				global: "shaDamage",
			},
			forced: true,
			popup: false,
			filter(event, player) {
				return player.getStorage('vl_telina_hs', false) ? true : false;
			},
			async content(event, trigger, player) {
				if (player.getStorage('vl_telina_hs', false) == '能命中') {
					player.popup('猜测成功');
					player.draw(2);
					player.setStorage('vl_telina_th', player.getStorage('vl_telina_th', 0) + 1)
				}
				else {
					player.popup('猜测失败');
					player.chooseToDiscard('猜测失败，请弃置一张牌', 'he', true);
				}
				player.setStorage('vl_telina_hs', false);
			},
			sub: true,
		},
		"4": {
			sub: true,
		},
	},
	ai: {
		threaten: 1.3,
	},
	t: {
		name: "慧视",
		info: "当一名角色对除你以外的角色使用【杀】时，若此【杀】的目标有手牌，你可以猜测此【杀】能否命中，若猜测正确，你摸两张牌，否则你须弃置一张牌。",
	},
};
