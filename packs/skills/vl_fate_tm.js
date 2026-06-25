import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin2",
    },
    forced: true,
    filter: function (event, player) {
					return !event.numFixed;
				},
    popup: false,
    content: function () {
					'step 0'
					if (get.isLuckyStar(player)) {
						event.num = 6;
						player.throwDice(6);
					}
					else player.throwDice();
					'step 1'
					game.log(player, 'D6投掷的结果为', '#g' + event.num)
					player.popup(event.num)
					trigger.num = event.num
				},
    group: ["vl_fate_tm_sha", "vl_fate_tm_miss"],
    subSkill: {
        sha: {
            locked: true,
            filter: function (event, player) {
							return event.card && event.card.name == 'sha'
						},
            prompt2: "进行一次r1D4，若结果为1，此【杀】伤害+1，若结果为3，此【杀】不计入出牌阶段的使用次数，若结果为4，此【杀】不可被闪避",
            trigger: {
                player: "useCardToPlayered",
            },
            check: function (event, player) {
							return get.attitude(player, event.player) < 0
						},
            content: function () {
							if (get.isLuckyStar(player)) {
								var num = Math.floor(Math.random() * 4) + 1
								if (num == 2) {
									num = 3
								}
							} else {
								var num = Math.floor(Math.random() * 4) + 1
							}
							game.log(player, 'D4投掷的结果为', '#g' + num)
							player.popup(num)
							if (num == 1) {
								var id = trigger.target.playerid;
								var map = trigger.getParent().customArgs;
								if (!map[id]) map[id] = {};
								if (typeof map[id].extraDamage != 'number') {
									map[id].extraDamage = 0;
								}
								map[id].extraDamage++;
							} else if (num == 4) {
								trigger.getParent().directHit.push(trigger.target)
							} else if (num == 3) {
								trigger.player.getStat().card.sha--;
							}
						},
            sub: true,
        },
        miss: {
            trigger: {
                source: "damageSource",
                player: "damageEnd",
            },
            popup: false,
            filter: function (event, player) {
							return player.storage.vl_fate_ss < 100
						},
            forced: true,
            content: function () {
							player.storage.vl_fate_ss += trigger.num
							player.updateMark('vl_fate_ss')
						},
            sub: true,
        },
    },
    t: {
        name: "骰命",
        info: "摸牌阶段，你改为摸r1D6张牌；当你使用【杀】指定目标后，你可以进行一次r1D4，若结果为1，此【杀】伤害+1，若结果为3，此【杀】不计入出牌阶段的使用次数，若结果为4，此【杀】不可被闪避；当你造成或受到伤害后，你的闪避值+X（X为此次伤害值）。",
    },
};
