import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        player: "useCardAfter",
    },
    filter(event, player) {
					return ['basic', 'trick'].includes(get.type(event.card, false)) && game.hasPlayer(function (current) {
						return current.countCards('h') >= player.countCards('h') && current.countCards('he') > 0
					});
				},
    async content(event, trigger, player) {
        const result = await player.chooseTarget(1, true, '###是否发动【达观】？###弃置一名手牌数不小于你的角色的一张牌')
            .set('ai', function (target) {
                var player = _status.event.player;
                return get.effect(target, { name: 'guohe_copy2' }, player, player);
            }).set('filterTarget', function (card, player, target) {
                return (target.countCards('h') >= player.countCards('h')) && target.countCards('he') > 0;
            }).forResult();
        await player.discardPlayerCard(result.targets[0], 'he', true);
    },
    t: {
        name: "达观",
        info: `锁定技，当你使用${get.poptip("jishi")}结算完毕后，你弃置手牌数不小于你的一名角色的一张牌。`,
    },
};
