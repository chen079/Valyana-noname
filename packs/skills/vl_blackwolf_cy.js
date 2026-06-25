import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    zhuanhuanji: true,
    marktext: "☯",
    mark: true,
    init(player, storage, skill) {
					if (!player.storage.vl_blackwolf_cy) player.storage.vl_blackwolf_cy = false
				},
    intro: {
        content(storage) {
						return storage ? '出牌阶段结束时，你可以摸X张牌（X为你本回合造成的伤害数），直到你的下个回合开始：当你成为其他角色【杀】或伤害类锦囊牌的目标时，若此牌目标数大于1，你取消之；否则，你弃置该角色一张牌。' : '出牌阶段开始时，你可以展示其他角色的一张手牌，然后你可以将与展示牌不同花色的一张手牌当作【出其不意】对该角色使用（每种花色限一次），若【出其不意】未造成伤害，你结束本回合，否则你可以重复此流程。';
					},
    },
    group: ["vl_blackwolf_cy_positive", "vl_blackwolf_cy_nagtive"],
    subSkill: {
        "1": {
            trigger: {
                target: "useCardToTargeted",
            },
            filter(event, player) {
							return (event.card.name == 'sha' || (get.type(event.card) == 'trick' && get.tag(event.card, 'damage'))) && event.targets;
						},
            forced: true,
            charlotte: true,
            async content(event, trigger, player) {
							if (trigger.targets.length > 1) {
								trigger.getParent().excluded.add(player);
							} else if (trigger.targets.length == 1) {
								player.discardPlayerCard(trigger.player, 'he', true)
							}
						},
        },
        positive: {
            trigger: {
                player: "phaseUseBegin",
            },
            direct: true,
            filter(event, player) {
							return !player.storage.vl_blackwolf_cy
            },
            async content(event, trigger, player) {
							const suits = [];
							let firsttime = true;
							while (true) {
								const targetResult = await player.chooseTarget(1, '展示一名其他角色的一张牌', function (card, player, target) {
        								return target != player && target.countCards('h') > 0
        							}).set('ai', function (target) {
        								const player = _status.event.player
        								return -get.attitude(player, target)
        							}).forResult();
								if (!targetResult.bool) return;
        								if(firsttime){
        									firsttime = false;
        									player.logSkill("vl_blackwolf_cy");
        									player.changeZhuanhuanji("vl_blackwolf_cy");
        								}
        								const target = targetResult.targets[0];
        								const shown = target.getCards('h').randomGet();
        								await target.showCards(shown, get.translation(target) + '展示了' + get.translation(shown));
									const tempSuit = suits;
        							if (!suits.includes(get.suit(shown))) {
        								tempSuit.push(get.suit(shown))
        							}
        							if (player.canUse({ name: 'chuqibuyi', isCard: true }, target)) {
        								const cardResult = await player.chooseCard(1, 'h', function (card, player) {
        									return !tempSuit.includes(get.suit(card))
        								}).set('prompt2', '将一张花色不为' + get.translation(tempSuit) + '的手牌当作【出其不意】对' + get.translation(target) + '使用')
        									.set('ai', function (card) {
        										const player = _status.event.player
        										if (get.attitude(player, target) > 0) {
        											return -1
        										} else {
        											return 7 - get.value(card)
        										}
        									}).forResult();
									if (!cardResult.bool) return;
        								const cardx = cardResult.cards[0];
        								suits.push(get.suit(cardx));
        								const useEvent = player.useCard(cardResult.cards, { name: 'chuqibuyi' }, target, false);
        								const related = useEvent.card;
									await useEvent;
									if (player.getHistory('sourceDamage', function (evt) {
        								let card = evt.card;
        								let evtx = evt.getParent('useCard');
        								return card && card.name == 'chuqibuyi' && evtx.card == card && evtx.card == related && evtx.getParent() == event;
        							}).length) {
										continue;
									}
        							} else {
        								return
        							}
        								for (const phase of lib.phaseName) {
        									const evt = event.getParent(phase);
        									if (evt?.name === phase && !evt.finished) {
        										//不触发cancelled时机
        										evt.cancel(true, null, true);
        										break;
        									}
        								}
        								const evt = event.getParent("phase", true);
        								if (evt) {
        									game.log(evt.player, "结束了回合");
        									evt.num = evt.phaseList.length;
        									evt.goto(11);
        								}
								return;
							}
    },
        },
        nagtive: {
            trigger: {
                player: "phaseUseEnd",
            },
            filter(event, player) {
							if(!(player.getStat()?.damage > 0))return;
							return player.storage.vl_blackwolf_cy
						},
            content: async function content(event, trigger, player) {
							player.changeZhuanhuanji("vl_blackwolf_cy");
							let stat = player.getStat();
							if (stat.damage && stat.damage > 0) {
								await player.draw(stat.damage)
							}
							player.addTempSkill('vl_blackwolf_cy_1', { player: "phaseBegin" })
						},
        },
    },
    t: {
        name: "潮涌",
        info: "转换技，阳：出牌阶段开始时，你可以展示其他角色的一张手牌，然后你可以将与展示牌不同花色的一张手牌当作【出其不意】对该角色使用（每种花色限一次），若【出其不意】未造成伤害，你结束本回合，否则你可以重复此流程。阴：出牌阶段结束时，你可以摸X张牌（X为你本回合造成的伤害数），直到你的下个回合开始：当你成为其他角色【杀】或伤害类锦囊牌的目标后，若此牌目标数大于1，你取消之；否则，你弃置该角色一张牌。",
    },
};
