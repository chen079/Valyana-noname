import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    vpSkill: true,
    filter(event, player) {
					return player.Vp > 0 && (player.getStat('skill').vl_souls_ch || 0) < player.maxVp;
				},
    async content(event, trigger, player) {
        player.consumeVp(1);
        const types = [];
        for (const name of lib.inpile) {
        						const type = get.type2(name);
        						if (!types.includes(type)) types.push(type);
        					}
        if (player.isUnderControl()) {
        						game.swapPlayerAuto(player);
        					}
        const colors = ['red', 'black'];
        const color = colors.map(i => get.translation(i));
        const type = types.map(i => get.translation(i));
        const dialog = ui.create.dialog('<span style="font-family=shousha;font-size:18px"><storage>存知</storage></span>', 'hidden');
        dialog.addText('选择颜色：');
        dialog.add([color, 'tdnodes']);
        dialog.addText('选择牌的类型：');
        dialog.add([type, 'tdnodes']);
        const result = await player.chooseButton(dialog, 2, true)
        					.set('ai', function (button) {
        						return 1 + Math.random()
        					}).set('filterButton', function (button) {
        						for (const selected of ui.selected.buttons) {
        							if ((color.includes(selected.link) && color.includes(button.link)) || (type.includes(selected.link) && type.includes(button.link))) {
        								return false;
        							}
        						}
        						return true;
        					}).forResult();
        if (!['红色', '黑色'].includes(result.links[0])) {
        						result.links.swapElements(0, 1)
        					}
        const selectedColor = colors.find(function (item) {
        						return get.translation(item) == result.links[0];
        					});
        const selectedType = types.find(function (item) {
        						return get.translation(item) == result.links[1];
        					});
        const card = get.cardPile(function (card) {
        						return get.color(card) == selectedColor && get.type2(card) == selectedType;
        					});
        if (card) {
        						await player.gain(card, 'gain2')
        					} else {
        						await player.draw()
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
            async content(event, trigger, player) {
							player.gainVp(1)
						},
        },
        loseMp: {
            trigger: {
                player: "damageEnd",
            },
            firstDo: true,
            direct: true,
            async content(event, trigger, player) {
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
