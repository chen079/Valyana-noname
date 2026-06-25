import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    vpSkill: true,
    filter: function (event, player) {
					return player.Vp > 0 && (player.getStat('skill').vl_souls_ch || 0) < player.maxVp;
				},
    content: function () {
					'step 0'
					player.consumeVp(1)
					event.types = []
					for (var i of lib.inpile) {
						if (!event.types.includes(get.type2(i))) event.types.push(get.type2(i))
					}
					if (player.isUnderControl()) {
						game.swapPlayerAuto(player);
					}
					event.colors = ['red', 'black']
					var color = event.colors.map(i => get.translation(i))
					var type = event.types.map(i => get.translation(i))
					var dialog = ui.create.dialog('<span style="font-family=shousha;font-size:18px"><storage>存知</storage></span>', 'hidden');
					dialog.addText('选择颜色：');
					dialog.add([color, 'tdnodes']);
					dialog.addText('选择牌的类型：');
					dialog.add([type, 'tdnodes']);
					var chooseButton = player.chooseButton(dialog, 2, true)
					chooseButton.set('ai', function (button) {
						return 1 + Math.random()
					}).set('filterButton', function (button) {
						for (var i = 0; i < ui.selected.buttons.length; i++) {
							if (color.includes(ui.selected.buttons[i].link) && color.includes(button.link) || type.includes(ui.selected.buttons[i].link) && type.includes(button.link)) {
								return false
							}
						}
						return true
					})
					'step 1'
					if (!['红色', '黑色'].includes(result.links[0])) {
						result.links.swapElements(0, 1)
					}
					var color = event.colors.find(function (item) {
						return get.translation(item) == result.links[0];
					});
					var type = event.types.find(function (item) {
						return get.translation(item) == result.links[1];
					});
					var card = get.cardPile(function (card) {
						return get.color(card) == color && get.type2(card) == type;
					});
					if (card) {
						player.gain(card, 'gain2')
					} else {
						player.draw()
					}
				},
    group: ["vl_souls_ch_recoverMp", "vl_souls_ch_loseMp"],
    subSkill: {
        recoverMp: {
            trigger: {
                global: ["roundStart"],
                source: "damageSource",
            },
            direct: true,
            content: function () {
							player.gainVp(1)
						},
        },
        loseMp: {
            trigger: {
                player: "damageEnd",
            },
            firstDo: true,
            direct: true,
            content: function () {
							player.gainMaxVp()
							player.loseVp()
						},
        },
    },
    t: {
        name: "存知",
        info: "出牌阶段限X次（X为你的魔力上限），<span class=\"bluetext\">①</span>，你指定一种颜色与一种类型，然后从牌堆中获得一张符合描述的牌（若没有则改为摸一张牌）。每轮开始时或当你造成伤害后，你获得1点魔力，当你受到伤害后，你获得1点魔力上限并失去1点魔力。",
    },
};
