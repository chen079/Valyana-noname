import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "gameDrawAfter",
        player: "enterGame",
    },
    unique: true,
    forced: true,
    init: function (player) {
					if (!player.storage.vl_jackson_eb) player.storage.vl_jackson_eb = [];
				},
    content: function () {
					"step 0"
					player.chooseTarget(Math.min(2, game.players.length - 1), true, "请选择〖纵沙〗的目标", "令" + Math.min(2, game.players.length - 1) + "名角色被标记", function (card, player, target) {
						return target != player
					});
					"step 1"
					if (result.targets.length == 1) {
						result.targets[0].addMark('vl_jackson_eb')
					} else {
						result.targets[0].addMark('vl_jackson_eb')
						result.targets[1].addMark('vl_jackson_eb')
					}
					player.addSkill("vl_jackson_eb_1")
					player.addSkill("vl_jackson_eb_2")
				},
    marktext: "纵沙",
    intro: {
        name2: "纵沙",
        content: "已被设下标记",
    },
    group: ["vl_jackson_eb_1", "vl_jackson_eb_2"],
    subSkill: {
        "1": {
            unique: true,
            trigger: {
                global: "recoverBegin",
            },
            forced: true,
            filter: function (event, player) {
							return event.player.hasMark('vl_jackson_eb')
						},
            logTarget: "player",
            content: function () {
							player.gainMaxHp(trigger.num)
							event.finish()
						},
            sub: true,
        },
        "2": {
            trigger: {
                global: "die",
            },
            unique: true,
            forced: true,
            preHidden: true,
            filter: function (event, player) {
							return event.player.hasMark('vl_jackson_eb') && game.findPlayer(function (current) {
								return !current.hasMark('vl_jackson_eb') && current != player
							})
						},
            content: function () {
							"step 0"
							event.togain = trigger.player.getCards('he');
							if(event.togain.length)player.gain(event.togain, trigger.player, 'giveAuto');
							"step 1"
							player.chooseTarget(1, true, "请选择〖纵沙〗的目标").set("filterTarget", function (card, player, target, skill) {
								return target.countMark('vl_jackson_eb') == 0 && player != target
							})
							"step 2"
							result.targets[0].addMark('vl_jackson_eb')
						},
            sub: true,
        },
    },
    t: {
        name: "纵沙",
        info: "锁定技，游戏开始时，你选择两名其他角色并使其获得“纵沙”标记；当该角色恢复体力时，你增加等量的体力上限；该角色死亡时，你可以获得该角色的所有牌，然后重新选择一名其他角色获得“纵沙”标记。",
    },
};
