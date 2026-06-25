import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: "vl_mislee_zr_1",
    enable: "phaseUse",
    usable: 1,
    check(card) {
					return 7 - get.value(card);
				},
    multitarget: true,
    targetprompt: ["被移走", "移动目标"],
    filterTarget(card, player, target) {
					if (ui.selected.targets.length) {
						var from = ui.selected.targets[0];
						var judges = from.getCards('j');
						for (var i = 0; i < judges.length; i++) {
							if (!target.hasJudge(judges[i].viewAs || judges[i].name)) return true;
						}
						if (target.isMin()) return false;
						if ((from.getEquip(1) && !target.getEquip(1)) ||
							(from.getEquip(2) && !target.getEquip(2)) ||
							(from.getEquip(3) && !target.getEquip(3)) ||
							(from.getEquip(4) && !target.getEquip(4)) ||
							(from.getEquip(5) && !target.getEquip(5))) return true;
						return false;
					}
					else {
						return target.countCards('ej') > 0;
					}
				},
    selectTarget: 2,
    async content(event, trigger, player) {
        if (targets.length != 2) return;
        const result = await player.choosePlayerCard(true, 'ej', function (button) {
            if (get.attitude(player, targets[0]) > get.attitude(player, targets[1])) {
                return get.position(button.link) == 'j' ? 10 : 0;
            } else {
                if (get.position(button.link) == 'j') return -10;
                return get.equipValue(button.link);
            }
        }, targets[0]).forResult();
        if (result.bool) {
            const card = result.buttons[0].link;
            if (get.position(card) == 'e') {
                await targets[1].equip(card);
            } else if (card.viewAs) {
                await targets[1].addJudge({ name: card.viewAs }, [card]);
            } else {
                await targets[1].addJudge(card);
            }
            targets[0].$give(card, targets[1]);
            game.delay();
        }
    },
    subSkill: {
        "1": {
            trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
            },
            forced: true,
            locked: false,
            getIndex(event, player) {
							const evt = event.getl(player);
							if (evt && evt.player === player && evt.es?.length) {
								return 1;
							}
							return false;
						},
            content: async function content(event, trigger, player) {
							player.draw(2);
						},
            ai: {
                noe: true,
                reverseEquip: true,
                effect: {
                    target(card, player, target, current) {
									if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
										return [1, 3];
									}
								},
                },
            },
        },
    },
    ai: {
        order: 10,
        result: {
            target(player, target) {
							if (ui.selected.targets.length == 0) {
								if (target.countCards('j') && get.attitude(player, target) > 0) return 1;
								if (get.attitude(player, target) < 0) {
									var players = game.filterPlayer();
									for (var i = 0; i < players.length; i++) {
										if (get.attitude(player, players[i]) > 0) {
											if ((target.getEquip(1) && !players[i].getEquip(1)) ||
												(target.getEquip(2) && !players[i].getEquip(2)) ||
												(target.getEquip(3) && !players[i].getEquip(3)) ||
												(target.getEquip(4) && !players[i].getEquip(4)) ||
												(target.getEquip(5) && !players[i].getEquip(5)))
												return -1;
										}
									}
								}
								return 0;
							}
							else {
								return get.attitude(player, ui.selected.targets[0]) > 0 ? -1 : 1;
							}
						},
        },
        expose: 0.2,
        threaten: 1.5,
    },
    t: {
        name: "移赠",
        info: "出牌阶段限一次，你可以将任意一名角色装备区或判定区的牌移动到另一名角色对应的区域。当你失去装备区的牌后，你摸两张牌。",
    },
};
