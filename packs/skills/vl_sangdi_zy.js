import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "gainAfter",
        global: "loseAsyncAfter",
    },
    filter(event, player) {
					var cards = event.getg(player);
					if (!cards.length) return false;
					return game.hasPlayer(current => {
						return event.getl(current).cards2.length;
					})
				},
    direct: true,
    async content(event, trigger, player) {
event.cards = trigger.getg(player);
        					event.targets = game.filterPlayer(current => {
        						if (current == player) return false;
        						return trigger.getl(current).cards2.length;
        					});
if (event.cards.some(card => get.color(card) == 'black')) {
        						await player.chooseUseTarget({ name: 'sha', isCard: true }, 'nodistance', '捉影：是否视为对' + get.translation(event.targets) + '使用一张【杀】', event.targets, 1);
        						return
        					}
        					if (event.cards.some(card => get.color(card) == 'red')) {
        						var targets = [player].concat(event.targets)
        						targets = targets.filter(target => target.isDamaged())
        						if (!targets.length) {
        							return
        						} else {
        							const result = await player.chooseTarget('捉影：是否视为对自己或' + get.translation(event.targets) + '使用一张【桃】', 1, function (card, player, target) {
        								var targets = [player].concat(event.targets)
        								targets = targets.filter(target => target.isDamaged())
        								return targets.includes(target)
        							}).set('ai', function (target) {
        								return get.attitude(player, target) > 0
        							}).forResult();
        							if (result.bool) {
        								await player.useCard({ name: 'tao', isCard: true }, result.targets[0])
        							}
        						}
        					}
    },
    t: {
        name: "捉影",
        info: "你获得其他的角色牌时，若其中含有黑色牌，可以视为你对其使用了一张【杀】，若其中含有红色牌，可以视为你或其使用了【桃】。",
    },
};
