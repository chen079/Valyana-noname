import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageBegin3",
    },
    filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current != event.source
					})
				},
    async content(event, trigger, player) {
        const targets = game.filterPlayer();
        					targets.remove(player)
        					targets.remove(trigger.source)
        					targets.sortBySeat()
        					event.targets = targets
        const num = trigger.num
        while (event.targets.length) {
        					event.target = event.targets.shift()
        					const result = await event.target.chooseBool('是否替' + get.translation(player) + '承受来自' + get.translation(trigger.source) + '的' + trigger.num + '点' + (trigger.nature ? get.translation(trigger.nature) + '属性' : '') + '伤害')
        						.set('ai', function () {
        							const target = _status.event.target
        							const player = _status.event.player
        							return get.attitude(player, target) > 0 && player.hp + player.hujia > num
        						}).set('target', player).forResult()
        if (result.bool) {
        						event.target.popup('代替');
        						game.log(event.target, '代替', player, '成为了伤害的目标')
        						trigger.player = event.target
        						return
        					} else {
        						event.target.popup('不代替');
        						await game.delay(2)
        					}
        }
    },
    t: {
        name: "祭蹈",
        info: "当你受到伤害时，你可以令伤害来源外的其他角色依次选择是否转移给自己。",
    },
};
