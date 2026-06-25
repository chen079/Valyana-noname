import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseUseEnd",
    },
    mark: true,
    init(player) {
					if (!player.storage.vl_kersm_my) player.storage.vl_kersm_my = [];
				},
    check(event, player) {
					if (player.countCards('h') * 2 < player.hp) return false;
					var judge = game.filterPlayer(function (current) {
						return current != player && get.attitude(player, current) > 0
					})
					if (judge.length) {
						return true
					}
					return false
				},
    async content(event, trigger, player) {
var targets = game.filterPlayer(function (target) {
        						return target != player
        					})
        					var num = Math.floor(player.countCards('h') / 2);
        					const result = await player.chooseCardTarget({
        						position: 'h',
        						filterCard: true,
        						filterTarget: function (card, player, target) {
        							return target != player;
        						},
        						selectTarget: 1,
        						targets: targets,
        						selectCard: num,
        						prompt: '将' + get.cnNumber(num) + '张手牌交给一名其他角色',
        						forced: true,
        						ai1: function (card) {
        							var goon = false, player = _status.event.player;
        							for (var i of _status.event.targets) {
        								if (get.attitude(i, target) > 0 && get.attitude(target, i) > 0) { goon = true; break };
        							}
        							if (goon) {
        								if (!player.hasValueTarget(card) || card.name == 'sha' && player.countCards('h', function (cardx) {
        									return cardx.name == 'sha' && !ui.selected.cards.includes(cardx);
        								}) > player.getCardUsable('sha')) return 2;
        								return Math.max(2, get.value(card) / 4);
        							}
        							return 1 / Math.max(1, get.value(card));
        						},
        						ai2: function (target) {
        							return get.attitude(_status.event.player, target);
        						},
        					}).forResult();
if (result.bool) {
        						var target = result.targets[0];
        						player.line(target, 'green');
        						const next = target.gain(result.cards, player, 'giveAuto');
        						player.skip('phaseDiscard')
        						player.storage.vl_kersm_my[0] = target
        						await next
        					}
    },
    intro: {
        markcount: () => undefined,
        content: "上次已对$发动过〖盟约〗",
    },
    t: {
        name: "盟约",
        info: "出牌阶段结束时，你可以选择一名角色并交给其X张手牌（X为你手牌数的一半，并向下取整），若如此做，你跳过本回合的弃牌阶段。",
    },
};
