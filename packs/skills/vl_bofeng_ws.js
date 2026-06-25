import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToPlayered",
    },
    filter(event, player) {
					if (get.tag(event.card, 'damage') && event.player != player) return true
				},
    direct: true,
    async content(event, trigger, player) {
					if (player.countCards('h') == 0) {
						await player.draw();
					} else {
						player.addTempSkill("vl_xieji", { player: "phaseEnd" });
						await player.addToExpansion(get.cards(1), 'gain2').gaintag.add('vl_xieji');
					}
					const cards = player.getExpansions('vl_xieji');
					if (!cards.length || !player.countCards('h')) return;
					const result = await player.chooseToMove('危视：是否交换“协”和手牌？')
						.set('list', [
							[get.translation(player) + '（你）的协', cards],
							['手牌区', player.getCards('h')],
						])
						.set('filterMove', function (from, to) {
							return typeof to != 'number';
						})
						.set('processAI', function (list) {
							var player = _status.event.player, cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return get.value(a) - get.value(b);
							}), cards2 = cards.splice(0, player.getExpansions('vl_xieji').length);
							return [cards2, cards];
						}).forResult();
					if (!result.bool) return;
					const pushs = result.moved[0], gains = result.moved[1];
					pushs.removeArray(player.getExpansions('vl_xieji'));
					gains.removeArray(player.getCards('h'));
					if (!pushs.length || pushs.length != gains.length) return;
					await player.addToExpansion(pushs, player, 'giveAuto').gaintag.add('vl_xieji');
					game.log(player, '将', pushs, '作为“协”置于武将牌上');
					await player.gain(gains, 'gain2');
    },
    t: {
        name: "危视",
        info: "当你成为其他角色伤害类牌的目标后，若你没有手牌，你摸一张牌，否则你从牌堆顶获得一张“协”；然后你可以等量交换你的“协”与手牌。",
    },
};
