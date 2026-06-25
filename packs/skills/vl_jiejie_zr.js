import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    content: function () {
					"step 0"
					player.chooseTarget(1, true).set("filterTarget", function (card, player, target) {
						return target != player
					}).set("ai", function (target) {
						var player = _status.event.player;
						return -get.attitude(player, target) / (1 + target.hp)
					})
					"step 1"
					var target = result.targets[0]
					target.addSkill('vl_jiejie_zr_1')
					target.loseHp()
					target.updateMark('vl_jiejie_zr_1')
					target.storage.vl_jiejie_zr_1 += 1
					player.gainMaxHp()
					player.recover()
				},
    subSkill: {
        "1": {
            mark: true,
            init: function (player) {
							if (!player.storage.vl_jiejie_zr_1) player.storage.vl_jiejie_zr_1 = 0;
						},
            marktext: "势",
            intro: {
                content: "已拥有$个标记",
            },
            sub: true,
        },
    },
    t: {
        name: "锋开",
        info: "准备阶段，你可以选择一名其他角色，若如此做，该角色获得一个“势”标记并失去1点体力，然后你提升1点体力上限并回复1点体力。",
    },
};
