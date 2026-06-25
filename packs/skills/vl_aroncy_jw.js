import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseDrawEnd",
    },
    filter(event, player) {
					if (get.mode() == 'guozhan' && source.isFriendOf(player)) return false
					return event.player != player && event.player.countCards('h') > player.countCards('h')
				},
    check(event, player) {
					const target = event.player;
					if (get.attitude(player, target) >= 0) return false;
					if (target.countCards('h') > 2) return true
					return false
				},
    content: async function content(event, trigger, player) {
					if (trigger.player.countCards('h', "sha") == 0) {
						await trigger.player.useCard({ name: 'sha', isCard: true }, player);
						return;
					}
					let result = await player.chooseCardButton(trigger.player, trigger.player.getCards('h')).set('filterButton', function (button) {
						return get.name(button.link) == 'sha';
					}).forResult();
					if (result.bool) {
						await player.gain(result.links[0]);
					}
					result = await player.chooseCardTarget({
						filterTarget(card, player, target) {
							if (target == player) return false;
							const stat = player.getStat('skill').vl_aroncy_jw_targets;
							return !stat || !stat.includes(target);
						},
						filter(event, player) {
							return player.countCards('h') > 0 && game.hasPlayer((current) => lib.skill.vl_aroncy_jw.filterTarget(null, player, current));
						},
						discard: false,
						lose: false,
						delay: false,
						filterCard: true,
						ai1(card) {
							if (get.tag(card, 'recover') && !game.hasPlayer(function (current) {
								return get.attitude(current, player) > 0 && !current.hasSkillTag('nogain');
							})) return 0;
							return 1 / Math.max(0.1, get.value(card));
						},
						ai2(target) {
							const player = _status.event.player;
							const att = get.attitude(player, target);
							if (target.hasSkillTag('nogain')) att /= 9;
							return 4 + att;
						},
						prompt: '请选择要送人的卡牌'
					}).forResult();
					if (!result.bool) return;
					const target = result.targets[0];
					player.line(target, 'green');
					await target.gain(result.cards, player, 'giveAuto').gaintag.add('vl_aroncy_jw');
					target.addSkill('vl_aroncy_jw_use');
					player.addSkill('vl_aroncy_jw_draw');
					const stat = player.getStat('skill');
					if (!stat.vl_aroncy_jw_targets) stat.vl_aroncy_jw_targets = [];
					stat.vl_aroncy_jw_targets.push(target);
				},
    subSkill: {
        draw: {
            trigger: {
                global: "useCardAfter",
            },
            forced: true,
            charlotte: true,
            filter(event, player) {
							return event.player.hasHistory('lose', function (evt) {
								if (evt.getParent() != event) return false;
								for (const i in evt.gaintag_map) {
									if (evt.gaintag_map[i].includes('vl_aroncy_jw')) {
										if (event.player.hasHistory('sourceDamage', function (evt) {
											return evt.card == event.card;
										})) {
											return true
										} else {
											return false
										}
									}
								}
								return false;
							});
						},
            logTarget: "player",
            content: async function content(event, trigger, player) {
							await player.draw();
							await trigger.player.draw()
						},
        },
        use: {
            mod: {
                targetInRange(card) {
								if (!card.cards) return;
								for (const i of card.cards) {
									if (i.hasGaintag('vl_aroncy_jw')) return true;
								}
							},
                cardDiscardable(card, player, name) {
								if (name == 'phaseDiscard' && card.hasGaintag('vl_aroncy_jw')) return false;
							},
                aiOrder(player, card, num) {
								if (get.itemtype(card) == 'card' && card.hasGaintag('vl_aroncy_jw')) return num + 1;
							},
            },
        },
    },
    t: {
        name: "缴武",
        info: "其他角色的出牌阶段开始时，若其手牌数大于你，你可以发动此技能。若其没有【杀】，则视为其对你使用一张【杀】（计入出杀次数）；否则，你可以观看其手牌并获得其一张【杀】，然后你可以将你的一张手牌交给一名其他角色并标记为“缴武”。“缴武”牌不计入手牌上限且使用“缴武”牌无距离限制；一名角色使用“缴武”牌后，若此牌造成了伤害，你与其各摸一张牌。",
    },
};
