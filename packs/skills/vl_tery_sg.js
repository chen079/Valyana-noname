import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    filter(event, player) {
					return event.player != player && player.countCards('he') > 0
				},
    mod: {
        maxHandcardBase(player, num) {
						return player.maxHp;
					},
    },
    async content(event, trigger, player) {
						const result = await player.chooseCard(1, 'he', get.prompt2('vl_tery_sg')).set('ai', function (card) {
							return 5 - get.value(card)
						}).forResult();
						if (!result.bool) return;
						const next = player.useCard(result.cards, { name: 'sha', nature: 'stab' }, trigger.player, false);
						await next;
						if (!player.getHistory('sourceDamage', function (evt) {
							return next.card == evt.card;
						}).length) {
							await trigger.player.useCard({ name: 'sha', isCard: true }, player, 'noai');
						};
    },
    t: {
        name: "伺攻",
        info: "锁定技，你的手牌上限等于体力上限。其他角色的回合结束时，你可以将一张牌当刺【杀】对该角色使用，若此牌未造成伤害，该角色视为对你使用一张【杀】。",
    },
};
