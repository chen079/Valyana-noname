import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    locked: true,
    mod: {
        cardSavable(card, player, target) {
						if (card.name == 'tao' || card.name == 'jiu') return false;
					},
        cardEnabled(card) {
						if (card.name == 'tao') return false;
					},
    },
    ai: {
        effect: {
            target(card, player, target, current) {
							if (get.tag(card, 'damage')) return 'zerotarget';
						},
        },
        threaten: 0,
        expose: 2,
    },
    group: ["vl_hars_yb_1", "vl_hars_yb_2", "vl_hars_yb_3", "vl_hars_yb_5", "vl_hars_yb_7"],
    subSkill: {
        "1": {
            trigger: {
                player: "dieBefore",
            },
            direct: true,
            forced: true,
            locked: true,
            forceDie: true,
            filter(event, player) {
							return player.hp <= 0 && player.maxHp > 0 && player.hp >= -10;
						},
            async content(event, trigger, player) {
							trigger.cancel();
							if (player.isDead() && player.maxHp > 0) {
								player.revive();
								player.hp = 0;
								player.update();
								game.log(player, '当前的体力值为[' + player.hp + ']。');
							}
						},
            sub: true,
        },
        "2": {
            trigger: {
                player: "recoverBefore",
            },
            direct: true,
            locked: true,
            forced: true,
            async content(event, trigger, player) {
							trigger.cancel()
						},
            sub: true,
        },
        "3": {
            trigger: {
                player: "phaseBegin",
            },
            direct: true,
            locked: true,
            forced: true,
            async content(event, trigger, player) {
							player.loseMaxHp()
							if (player.maxHp <= 0) {
								player.die()
							}
						},
            sub: true,
        },
        "5": {
            trigger: {
                global: "phaseBegin",
            },
            forced: true,
            locked: true,
            priority: 4,
            logTarget: "player",
            async content(event, trigger, player) {
if (game.zhu && game.zhu.hasSkill('vl_hars_yb')) {
        								game.showIdentity();
        								let numx = game.players.length;
        								let list = 0;
        								for (let i = 0; i < game.players.length; i++) {
        									if (game.players[i].hasSkill('vl_hars_yb')) list++;
        								}
        								let nei = 0;
        								let n = [];
        								for (let i = 0; i < game.players.length; i++) {
        									if (game.players[i].identity == 'nei') {
        										if (!game.players[i].hasSkill('vl_hars_yb')) {
        											nei++;
        											n.add(game.players[i]);
        										}
        									}
        								}
        								game.log('场上剩余【' + nei + '】名内奸。');
        								game.log('场上有【' + numx + '】名玩家，其中有【' + list + '】名傀尸（视为已死亡）。');
        								if (nei > 0 && numx == (list + 1)) {
        									game.over(game.me.identity == 'nei');
        									game.log('游戏结束，内奸', n, '获胜。');
        								}
        								else {
        									let f = [];
        									for (let i = 0; i < game.players.length; i++) {
        										if (game.players[i].identity == 'fan') f.add(game.players[i]);
        									}
        									game.over(game.me.identity == 'fan');
        									game.log('游戏结束，反贼', f, '获胜。');
        									return;
        								}
        							}
        							else {
        								if (trigger.player.identity != 'nei') {
        									let num1 = trigger.player.getFriends(true).length;
        									let num2 = game.players.length - trigger.player.getFriends(true).length;
        									let list1 = 0;
        									let list2 = 0;
        									for (let a = 0; a < game.players.length; a++) {
        										if (game.players[a].hasSkill('vl_hars_yb')) list1++;
        									}
        									for (let b = 0; b < trigger.player.getFriends(true).length; b++) {
        										if (trigger.player.getFriends(true)[b].hasSkill('vl_hars_yb')) list2++;
        									}
        									let list3 = (list1 - list2);
        									if (num2 == list3) {
        										let bool = false;
        										if (trigger.player == game.me || trigger.player.isFriendOf(game.me)) bool = true;
        										else switch (get.mode()) {
        											case 'identity': {
        												game.showIdentity();
        												let id1 = trigger.player.identity;
        												let id2 = game.me.identity;
        												if (['zhu', 'zhong'].includes(id1)) {
        													if (['zhu', 'zhong'].includes(id2)) bool = true;
        													break;
        												}
        												break;
        											}
        										}
        										game.over(bool);
        										game.log(trigger.player, '胜：有【' + num2 + '】名敌人，其中有【' + list3 + '】名傀尸（视为已死亡）。');
        										game.log('游戏结束，', trigger.player.getFriends(true), '获胜。');
        									}
        									else {
        										if (num1 == list2) {
        											game.log(trigger.player, '负：有【' + num1 + '】名队友，其中有【' + list2 + '】名傀尸（视为已死亡）。己方阵营失败。');
        											game.log('等待最终胜出者的回合开始，那之后游戏结束。');
        										}
        									}
        								}
        							}
    },
            sub: true,
        },
        "7": {
            forced: true,
            trigger: {
                player: "phaseDrawBegin2",
            },
            frequent: true,
            filter(event, player) {
							return !event.numFixed;
						},
            async content(event, trigger, player) {
							trigger.num += player.maxHp;
						},
            sub: true,
        },
    },
    t: {
        name: "傀尸",
        info: "锁定技，你的体力值小于0后不会死亡，当你体力上限等于0时死亡。你的回合开始时，你失去1点体力上限。每名角色的回合开始时，判断一次游戏胜负，此时拥有技能“傀尸”的角色在规则中视为已死亡。你无法回复体力且其他角色不能对你使用【桃】。摸牌阶段你多摸X张牌（X为你的体力上限）。",
    },
};
