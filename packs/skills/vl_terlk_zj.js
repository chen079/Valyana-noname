import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseUseBegin",
    },
    direct: true,
    content: function () {
					"step 0"
					var num = game.countPlayer(function (current) {
						return current.isDamaged();
					});
					player.draw(num)
					"step 1"
					var recover = 0, lose = 0, players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].hp < players[i].maxHp) {
							if (get.attitude(player, players[i]) > 0) {
								if (players[i].hp < 2) {
									lose--;
									recover += 0.5;
								}
								lose--;
								recover++;
							}
							else if (get.attitude(player, players[i]) < 0) {
								if (players[i].hp < 2) {
									lose++;
									recover -= 0.5;
								}
								lose++;
								recover--;
							}
						}
						else {
							if (get.attitude(player, players[i]) > 0) {
								lose--;
							}
							else if (get.attitude(player, players[i]) < 0) {
								lose++;
							}
						}
					}
					var prompt = get.prompt('vl_terlk_zj');
					player.chooseControl('失去体力', '回复体力', 'cancel2',
						ui.create.dialog(get.prompt('vl_terlk_zj'), 'hidden')).ai = function () {
							if (lose > recover && lose > 0) return 0;
							if (lose < recover && recover > 0) return 1;
							return 2;
						}
					"step 2"
					if (result.control == 'cancel2') {
						event.finish();
					}
					else {
						player.logSkill('vl_terlk_zj');
						event.bool = (result.control == '回复体力');
						event.num = 0;
						event.players = game.filterPlayer();
					}
					"step 3"
					if (event.num < event.players.length) {
						var target = event.players[event.num];
						if (event.bool) {
							target.recover();
						}
						else {
							target.loseHp();
						}
						event.num++;
						event.redo();
					}
					"step 4"
					player.turnOver()
					player.addTempSkill('vl_terlk_zj_use')
				},
    ai: {
        expose: 0.1,
        threaten: 2,
    },
    subSkill: {
        use: {
            mod: {
                targetInRange: function (card, player, target) {
								if (player.inRange(target)) {
									return true;
								}
							},
                cardUsableTarget: function (card, player, target) {
								if (player.inRange(target)) return true;
							},
                aiValue: function (player, card, num) {
								if (card.name == 'zhangba') return 15;
								if (player.getEquip('zhangba') && player.countCards('hs') > 1 && ['shan', 'tao'].includes(card.name)) return 0;
								if (card.name == 'shan' || card.name == 'tao') return num / 2;
							},
            },
            sub: true,
        },
    },
    t: {
        name: "斩棘",
        info: "出牌阶段开始时，你可以令所有角色失去或回复1点体力，若如此做，你摸X张牌（X为场上已受伤的角色数）并翻面，然后本回合你对攻击范围内的角色使用牌无距离与次数限制。",
    },
};
