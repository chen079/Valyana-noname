import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    shaRelated: true,
    trigger: {
        player: "useCardToPlayered",
    },
    check: (event, player) => player.hp > 1 && get.attitude(player, event.target) < 0,
    filter: (event, player) => event.card.name == 'sha',
    content: () => {
					'step 0'
					player.loseHp()
					'step 1'
					var id = trigger.target.playerid;
					var map = trigger.customArgs;
					if (!map[id]) map[id] = {};
					if (!map[id].extraDamage) map[id].extraDamage = 0;
					map[id].extraDamage += 1;
					'step 2'
					if (player.countCards('hs', 'sha') > 0) {
						player.chooseToDiscard('hs', [1, trigger.target.countCards('he')], function (card) {
							return card.name == 'sha'
						}).set('ai', function (card) {
							return 7 - get.value(card)
						}).set('prompt', '请弃置任意张【杀】')
					} else {
						event.finish()
					}
					'step 3'
					if (result.bool) {
						player.discardPlayerCard(trigger.target, result.cards.length, 'he')
					}
				},
    t: {
        name: "碎岩",
        info: "你使用【杀】指定一名角色为目标后，你可失去1点体力令此【杀】对其伤害+1，然后可以弃置任意张【杀】并弃置其等量牌。",
    },
};
