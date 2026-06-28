import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "phaseJieshuBegin",
	},
	init(player) {
		if (!player.hasStorage('vl_guotang_yl')) player.setStorage('vl_guotang_yl', [])
	},
	mark: true,
	intro: {
		mark(dialog, storage, player) {
			dialog.addText('成为过【永良】目标的角色：');
			dialog.addText(player.getStorage('vl_guotang_yl', []).map(i => get.translation(i)));
		},
	},
	direct: true,
	async content(event, trigger, player) {
		const result = await player.chooseTarget(get.prompt2('vl_guotang_yl'), [1, player.hp]).set('ai', function (target) {
			let player = _status.event.player
			let att = get.attitude(player, target)
			if (att > 0) {
				if (target.hp == target.countCards('h') + 1) return att + 2
				return att
			} else {
				return -1
			}
		}).forResult();
		if (!result.bool) return;
		for (const target of result.targets) {
			player.markAuto('vl_guotang_yl', target);
		}
		for (const target of result.targets) {
			await target.draw();
			if (target.countCards('h') == target.hp) {
				await target.recover();
				await player.draw();
			}
		}
	},
	t: {
		name: "永良",
		info: "结束阶段，你可令至多X名角色各摸一张牌，若其因此手牌数与其体力值相同，则其回复1点体力，然后你摸一张牌。（X为你当前体力值）",
	},
};
