import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["phaseEnd"],
    },
    filter: (event, player, onrewrite) => {
					return event.player != player && event.player.countCards('e') > 0 && event.player.getHistory('useCard').length == 0;
				},
    direct: true,
    async content(event, trigger, player) {
        const result = await player.chooseToDiscard(1, 'h', get.prompt2('vl_rabby_xj')).set('ai', function (card) {
            var player = _status.event.player;
            if (get.attitude(player, trigger.player) < 0 && trigger.player.countCards('e') > 0) {
                return 6 + trigger.player.countCards('e') - get.value(card);
            } else {
                return -1;
            }
        }).forResult();
        if (result.bool) {
            await trigger.player.discard(trigger.player.getCards('e'));
        }
    },
    t: {
        name: "卸甲",
        info: "其他角色回合结束时，若其装备区有牌且其回合内没有使用过牌，你可以弃置一张牌，然后令其弃置其装备区的所有牌。",
    },
};
