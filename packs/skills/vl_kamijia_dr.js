import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "damageAfter",
	},
	firstDo: true,
	filter(event, player) {
		return event.source && event.source != player
	},
	frequent: true,
	locked: true,
	async content(event, trigger, player) {
		await player.draw(trigger.num)
		let list = ['red', 'black']
		const result = await player.chooseControl(list, 'cancel2').set('ai', function () {
			return list.randomGet()
		}).set('prompt', get.prompt2('vl_kamijia_dr')).forResult()
		if (result.control != 'cancel2') {
			player.popup(get.translation(result.control))
			const next = player.judge('vl_kamijia_dr', function (card) {
				return (get.color(card) == result.control) ? 2 : -1
			});
			next.judge2 = function (result) {
				return result.bool;
			};
			const judgeResult = await next.forResult();
			if (judgeResult.judge > 0) {
				await player.recover(trigger.num)
			}
		} else {
			return
		}
	},
	t: {
		name: "夺刃",
		info: "锁定技，当你受到伤害结算完毕后，你可以摸X张牌（X为此次伤害值），然后你可以声明一种颜色并进行判定，若判定牌与你声明的颜色相同，你回复等同于此次伤害值的体力。",
	},
};
