import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    usable: 1,
    trigger: {
        player: "damageBegin4",
    },
    filter: function (event, player) {
					return event.source && event.source != player && game.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) == 0
				},
    frequent: true,
    content: async function content(event, trigger, player) {
					trigger.cancel()
					await player.draw();
					await trigger.source.draw();
					await player.changeHujia(1,null,true);
				},
    ai: {
        maixie_defend: true,
        threaten: 0.9,
        effect: {
            target: function (card, player, target) {
							if (player.hasSkillTag('jueqing')) return;
							if (target.hujia) return;
							if (player._vl_xiaomo_ld_tmp) return;
							if (target.hasSkill('vl_xiaomo_ld_ai')) return;
							if (_status.event.getParent('useCard', true) || _status.event.getParent('_wuxie', true)) return;
							if (get.tag(card, 'damage')) {
								if (target.getHistory('damage').length == 0 && player.countCards('hs', { name: 'sha' }) + player.countCards('hs', { name: 'juedou' }) < 2) {
									return [0, 0];
								}
								if (target.getHistory('damage').length > 0) {
									return [1, -2];
								}
								else {
									if (get.attitude(player, target) > 0 && target.hp > 1) {
										return 0;
									}
									if (get.attitude(player, target) < 0 && !player.hasSkillTag('damageBonus')) {
										if (card.name == 'sha') return;
										var sha = false;
										player._vl_xiaomo_ld_tmp = true;
										var num = player.countCards('h', function (card) {
											if (card.name == 'sha') {
												if (sha) {
													return false;
												}
												else {
													sha = true;
												}
											}
											return get.tag(card, 'damage') && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
										});
										delete player._vl_xiaomo_ld_tmp;
										if (player.hasSkillTag('damage')) {
											num++;
										}
										if (num < 2) {
											var enemies = player.getEnemies();
											if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
												return;
											}
											return 0;
										}
									}
								}
							}
						},
        },
    },
    subSkill: {
        damaged: {
            sub: true,
        },
        ai: {
            sub: true,
        },
    },
    t: {
        name: "灵动",
        info: "当你每回合第一次受到伤害时，若此伤害为其他角色造成的，你可以取消之并与其各摸一张牌，然后你获得1点护甲。",
    },
};
