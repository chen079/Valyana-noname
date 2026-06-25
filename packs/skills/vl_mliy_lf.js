import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
        player: "enterGame",
    },
    init: function (player) {
					if (!player.storage.vl_mliy_lf_num) player.storage.vl_mliy_lf_num = [];
				},
    frequent: true,
    mark: true,
    intro: {
        content: function (storage, player, skill) {
						if (player.storage.vl_mliy_lf_num) { return "已记录花色：" + get.translation(player.storage.vl_mliy_lf_num) }
					},
        onunmark: true,
    },
    filter: function (event, player) {
					if (player.storage.vl_mliy_lf_num.length == 4) return false
					return true
				},
    content: function () {
					"step 0"
					player.judge()
					"step 1"
					if (!player.getStorage('vl_mliy_lf_num').includes(result.suit)) {
						player.markAuto('vl_mliy_lf_num', [result.suit]);
					}
					var suit = player.getStorage('vl_mliy_lf_num')
					game.broadcastAll(function (player, suit) {
						if (player.marks.vl_mliy_lf) player.marks.vl_mliy_lf.firstChild.innerHTML = "流风 " + get.translation(suit[0]) + get.translation(suit[1]) + get.translation(suit[2]) + get.translation(suit[3]);
					}, player, suit);
				},
    group: "vl_mliy_lf_1",
    subSkill: {
        "1": {
            direct: true,
            trigger: {
                player: "loseAfter",
                global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
            },
            filter: function (event, player) {
							const evt=event.getl(player);
							if(evt?.cards2?.length) return;
							return player != _status.currentPhase;
						},
            getIndex: function getIndex(event, player){
							let num = 0
							const evt=event.getl(player);
							for (let i = 0; i < evt.cards2.length; i++) {
								if (player.getStorage('vl_mliy_lf_num').includes(get.suit(evt.cards2[i]))) {
									num += 1;
								}
							}
							return num;
						},
            content: function () {
							player.draw(num);
						},
            sub: true,
        },
        num: {
            sub: true,
        },
    },
    t: {
        name: "流风",
        info: "一轮游戏开始时，若你有未被记录的花色，你可以进行判定，然后记录该判定牌的花色；当你于回合外失去一张已被记录花色牌后，你摸一张牌。",
    },
};
