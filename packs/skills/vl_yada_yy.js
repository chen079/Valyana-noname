import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		global: ["loseAfter", "loseAsyncAfter"],
	},
	direct: true,
	filter(event, player) {
		if (event.type != 'discard' || event.getlx === false) return false;
		const evt = event.getl(event.player);
		return evt && evt.hs && evt.hs.length > 0 && player.countCards('h') > 0;
	},
	async content(event, trigger, player) {
		if (game.hasPlayer(current => current.countCards('h') <= player.countCards('h'))) {
			const targetResult = await player.chooseTarget(get.prompt('vl_yada_yy'), '选择一名手牌数不大于你的角色交换手牌，或点击取消交给其一张手牌并展示之，本回合其同花色手牌视为【毒】', function (card, player, target) {
				return target != player && target.countCards('h') <= player.countCards('h')
			}).set('ai', function (target) {
				return get.attitude(player, target) * Math.sqrt(target.countCards('h') + 1);
			}).forResult();
			if (targetResult.bool) {
				await player.swapHandcards(targetResult.targets[0]);
				return
			}
		}
		if (trigger.player != player) {
			const cardResult = await player.chooseCard('h', get.prompt('vl_yada_yy')).set('ai', function (card) {
				if (get.attitude(player, trigger.player) < 0) {
					return 5 - get.value(card)
				} else {
					return -1
				}
			}).set('prompt2', '交给' + get.translation(trigger.player) + '一张手牌并展示之，本回合其同花色手牌视为【毒】')
				.forResult()
			if (cardResult.bool) {
				const card = cardResult.cards[0]
				player.showCards(card)
				const giveEvent = player.give(card, trigger.player)
				trigger.player.addTempSkill('vl_yada_yy_1')
				trigger.player.setStorage('vl_yada_yy_1', get.suit(card))
				await giveEvent;
			}
		} else {
			return
		}
	},
	subSkill: {
		"1": {
			mod: {
				cardname(card, player) {
					if (card.suit == player.getStorage('vl_yada_yy_1', '')) return 'du';
				},
			},
			mark: true,
			intro: {
				content(storage, player, skill) {
					return '你的' + get.translation(player.getStorage('vl_yada_yy_1', '')) + '牌均视为【毒】直到回合结束。'
				},
			},
		},
	},
	t: {
		name: "夜影",
		info: "有角色的手牌被弃置后，你可以选择一项：\n\t\t\t<li>1. 与一名手牌不多于你的角色交换手牌；\n\t\t\t<li>2. 交给其一张手牌并展示之，本回合其同花色手牌视为【毒】",
        taici: ['影衣披身，众目皆盲。', '看见我的人，往往已经太晚。'],
    },
};
