import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        target: "useCardToTargeted",
    },
    check(event, player) {
					return get.attitude(player, event.player) < 0;
				},
    filter(event, player) {
					return event.card.name == 'sha' && player.canCompare(event.player) > 0;
				},
    async content(event, trigger, player) {
        const next = player.chooseToCompare(trigger.player);
        trigger.getParent().excluded.add(player);
        const result = await next.forResult();
        if (result.bool) {
        						await player.draw(2)
        						await trigger.player.loseHp()
        					} else {
        						await player.loseHp()
        						await player.discardPlayerCard(trigger.player, 'he', true);
        					}
    },
    t: {
        name: "守宝",
        info: "当你成为其他角色使用【杀】的目标后，你可以与该角色拼点并令此牌对你无效，若你赢，你摸两张牌，然后令其失去1点体力，否则，你失去1点体力并弃置其一张牌。",
    },
};
