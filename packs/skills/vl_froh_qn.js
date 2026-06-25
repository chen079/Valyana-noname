import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "damageEnd",
	},
	forced: true,
	filter(event, player) {
		return game.filterPlayer().slice(0).remove(player).length > 0;
	},
	content: async function content(event, trigger, player) {
		const targets = game.filterPlayer().slice(0).remove(player).sortBySeat();
		if (!player.storage.hubian) {
			for (let target of targets) {
				var result = await target.chooseCard('he', '是否交给' + get.translation(player) + '一张牌，然后获得1层' + get.dialogIntro('lingmi') + '与' + get.dialogIntro('guwu'))
					.set('ai', function (card) {
						if (get.attitude(_status.event.player, player) > 0) {
							return 6 - get.value(card)
						} else {
							return 3 - get.value(card)
						}
					}).forResult();
				if (result.bool) {
					await target.give(result.cards, player);
				}
			}
			for (let target of targets.filter(c => c.isIn())) {
				target.addVuff('yujian')
				target.addVuff('guwu')
			}
			player.addVuff('yujian')
			player.addVuff('guwu')
		} else {
			for (let i of targets) {
				await i.damage('unreal', player);
			}
		}
	},
	t: {
		name: "戕怒",
		info: `${get.poptip("hubianji")}，锁定技。当你受到伤害后，<li>暗涌：所有其他角色可以交给你一张牌，交给你牌的角色与你各获得1层「预见」与「鼓舞」<li>圣咏：你视为对所有其他角色造成过1点伤害。`,
	},
};
