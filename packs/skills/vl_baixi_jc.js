import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        cardUsable(card, player, num) {
						if (card.name == 'jiu') return Infinity;
					},
    },
    enable: "chooseToUse",
    filterCard(card) {
					return get.suit(card) == 'spade';
				},
    viewAs: {
        name: "jiu",
    },
    position: "hs",
    viewAsFilter(player) {
					return player.hasCard(card => get.suit(card) == 'spade', 'hs');
				},
    prompt: "将一张黑桃手牌当酒使用",
    check(cardx, player) {
					if (player && player == cardx.player) return true;
					if (_status.event.type == 'dying') return 1;
					const current = _status.event.player;
					const shas = current.getCards('hs', function (card) {
						return card != cardx && get.name(card, current) == 'sha';
					});
					if (!shas.length) return -1;
					if (shas.length > 1 && (current.getCardUsable('sha') > 1 || current.countCards('hs', 'zhuge'))) {
						return 0;
					}
					shas.sort(function (a, b) {
						return get.order(b) - get.order(a);
					});
					let card = false;
					if (shas.length) {
						for (let i = 0; i < shas.length; i++) {
							if (shas[i] != cardx && lib.filter.filterCard(shas[i], current)) {
								card = shas[i]; break;
							}
						}
					}
					if (card) {
						if (game.hasPlayer(function (current) {
							return (get.attitude(_status.event.player, current) < 0 &&
								!current.hasShan()
								&& current.hp + current.countCards('h', { name: ['tao', 'jiu'] }) > 1 + (_status.event.player.storage.jiu || 0)
								&& _status.event.player.canUse(card, current, true, true) &&
								!current.hasSkillTag('filterDamage', null, {
									player: _status.event.player,
									card: card,
									jiu: true,
								}) &&
								get.effect(current, card, _status.event.player) > 0);
						})) {
							return 4 - get.value(cardx);
						}
					}
					return -1;
				},
    ai: {
        threaten: 1.5,
        basic: {
            useful(card, i) {
							if (_status.event.player.hp > 1) {
								if (i == 0) return 4;
								return 1;
							}
							if (i == 0) return 7.3;
							return 3;
						},
            value(card, player, i) {
							if (player.hp > 1) {
								if (i == 0) return 5;
								return 1;
							}
							if (i == 0) return 7.3;
							return 3;
						},
        },
        order() {
						let so = get.order({ name: 'sha' });
						if (so > 0) return so + 0.2;
						return 0;
					},
        result: {
            target(player, target) {
							if (target && target.isDying()) return 2;
							if (!target || target._jiu_temp || !target.isPhaseUsing()) return 0;
							if (!target.getCardUsable('sha') || lib.config.mode == 'stone' && !player.isMin() && player.getActCount() + 1 >= player.actcount) return 0;
							let shas = player.getCards('hs', 'sha'), card;
							if (!target.hasSha() || shas.length > 1 && (target.getCardUsable('sha') > 1 || target.countCards('hs', 'zhuge'))) return 0;
							target._jiu_temp = true;
							if (shas.length) shas.sort(function (a, b) {
								return get.order(b) - get.order(a);
							});
							else shas.push({ name: 'sha' });
							for (let i = 0; i < shas.length; i++) {
								let tars = [];
								if (lib.filter.filterCard(shas[i], target)) tars = game.filterPlayer(function (current) {
									return get.attitude(target, current) < 0 && target.canUse(shas[i], current, null, true) && get.effect(current, shas[i], target) > 0;
								});
								if (!tars.length) continue;
								tars.sort(function (a, b) {
									return get.effect(b, shas[i], target) - get.effect(a, shas[i], target);
								});
								if (tars[0].hasSkillTag('filterDamage', null, {
									player: target,
									card: shas[i],
									jiu: true
								})) break;
								if (!tars[0].mayHaveShan() || target.hasSkillTag('directHit_ai', true, {
									target: tars[0],
									card: shas[i]
								}, true) || target.needsToDiscard() > Math.max(0, 3 - target.hp)) {
									delete target._jiu_temp;
									return 1;
								}
							}
							delete target._jiu_temp;
							return 0;
						},
        },
        tag: {
            save: 1,
            recover: 0.1,
        },
    },
    t: {
        name: "酒池",
        info: "①你可以将一张黑桃手牌当做【酒】使用。②锁定技，你使用【酒】无次数限制。",
    },
};
