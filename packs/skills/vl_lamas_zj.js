import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: ["vl_lamas_zj_1", "vl_lamas_zj_2"],
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    direct: true,
    async content(event, trigger, player) {
					let num = Math.ceil(game.players.length / 2);
					while (num > 0) {
						const targetResult = await player.chooseTarget(get.prompt2(event.name), 1, function (card, player, target) {
        						return target.countCards('hej') > 0
        					}, function (target) {
        						var player = _status.event.player;
        						return get.effect(target, { name: 'guohe_copy2' }, player, player);
        					}).forResult();
						if (!targetResult.bool) return;
						const target = targetResult.targets[0];
						const cardResult = await player.choosePlayerCard('hej', [1, num], target, true)
							.set('prompt', '选择' + get.translation(target) + '的至多' + get.cnNumber(num) + '张牌')
							.forResult();
						if (!cardResult.bool) return;
						num -= cardResult.cards.length;
						await player.addToExpansion(cardResult.cards, target, 'give').gaintag.add('vl_lamas_zj');
					}
    },
    intro: {
        content: "expansion",
        markcount: "expansion",
    },
    onremove(player) {
					var cards = player.getExpansions('vl_lamas_zj');
					if (cards.length) player.loseToDiscardpile(cards);
				},
    ai: {
        threaten: 2,
    },
    subSkill: {
        "1": {
            enable: "chooseToUse",
            filter(event, player) {
							return player.getExpansions('vl_lamas_zj').length > 0 && event.filterCard({ name: 'sha', isCard: true }, player, event);
						},
            direct: true,
            chooseButton: {
                dialog(event, player) {
								return ui.create.dialog('战尽', player.getExpansions('vl_lamas_zj'), 'hidden');
							},
                backup(links, player) {
								return {
									viewAs: { name: 'sha', isCard: true },
									filterCard: () => false,
									selectCard: -1,
									card: links[0],
									async precontent(event, trigger, player) {
										player.logSkill('vl_lamas_zj');
										await player.loseToDiscardpile(lib.skill.vl_lamas_zj_1_backup.card);
										delete event.result.skill;
									},
								};
							},
                prompt: () => '请选择【杀】的目标',
            },
            ai: {
                order() {
								return get.order({ name: 'sha' }) + 0.6;
							},
                result: {
                    player: 1,
                },
            },
        },
        "2": {
            trigger: {
                target: "shaBefore",
            },
            direct: true,
            async content(event, trigger, player) {
							var cards = player.getExpansions('vl_lamas_zj');
							if (cards.length) player.gain(cards, 'gain2');
						},
        },
    },
    t: {
        name: "战尽",
        info: "准备阶段，你可以将任意角色区域内的总计X张牌置于你的武将牌上称为“战”（X存活角色数的一半并向上取整）；当你成为【杀】的目标后，你获得你武将牌上的所有“战”；你可以移去一张“战”，视为使用一张【杀】。",
    },
};
