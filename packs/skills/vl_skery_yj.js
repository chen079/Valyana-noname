import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: "useCard",
	},
	filter(event, player) {
		return (event.card.name == 'jiu' || event.card.name == 'tao') && event.player != player && player.countCards('h') > 0;
	},
	direct: true,
	async content(event, trigger, player) {
		const goon = (ai.get.attitude(player, trigger.player) < 0)
		const next = player.chooseToDiscard(1, 'h', false).set('prompt', get.prompt('vl_skery_yj'))
			.set('prompt2', '你可以弃置一张手牌并进行一次判定，若结果为黑色，此牌无效；若结果为红色，该角色弃置两张牌。')
		next.ai = function (card) {
			if (goon) {
				return 8 - ai.get.value(card);
			}
			return 0;
		}
		next.logSkill = ['vl_skery_yj', trigger.player];
		const discardResult = await next.forResult();
		if (!discardResult.bool) return;
		const judgeResult = await player.judge().forResult();
		switch (judgeResult.color) {
			case 'red': await player.discardPlayerCard(2, trigger.player, 'h', true); break;
			case 'black': trigger.cancel(); break;
		}
	},
	t: {
		name: "饮鸩",
		info: "其他角色使用【酒】或【桃】生效前，你可以弃置一张手牌并进行判定，若结果为红色，你弃置其两张手牌；若结果为黑色，此牌无效。",
	},
};
