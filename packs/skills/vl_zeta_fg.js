import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardAfter",
    },
    init: function (player) {
					if (!player.storage.vl_zeta_fg) player.storage.vl_zeta_fg = ['basic', 'trick', 'equip']
				},
    filter: function (event, player) {
					return event.card && player.storage.vl_zeta_fg.includes(get.type2(event.card))
				},
    frequent: true,
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						dialog.addText('目前可用的类型');
						var list = []
						for (var i = 0; i < player.storage.vl_zeta_fg.length; i++) {
							list.push(get.translation(player.storage.vl_zeta_fg[i]) + '牌')
						}
						dialog.addText(list.join('、'))
					},
    },
    content: function () {
					'step 0'
					player.storage.vl_zeta_fg.remove(get.type2(trigger.card))
					player.chooseControl('基本牌', '非基本牌').set('prompt', '请选择你想检索牌的类型').set('ai', function () {
						return ['基本牌', '非基本牌'].randomGet()
					})
					'step 1'
					player.storage.index = result.index
					'step 2'
					var cards = get.cards()
					if (player.storage.index == 0) {
						if (get.type2(cards[0]) == 'basic') {
							player.gain(cards)
							event.finish()
							return
						} else {
							player.discard(cards)
							event.redo()
						}
					} else {
						if (get.type2(cards[0]) != 'basic') {
							player.gain(cards)
							event.finish()
							return
						} else {
							player.discard(cards)
							event.redo()
						}
					}
				},
    group: "vl_zeta_fg_1",
    subSkill: {
        "1": {
            trigger: {
                global: "roundStart",
                player: "enterGame",
            },
            forced: true,
            unique: true,
            content: function () {
							player.storage.vl_zeta_fg = ['basic', 'trick', 'equip']
							player.updateMark('vl_zeta_fg')
						},
            sub: true,
        },
    },
    t: {
        name: "复归",
        info: "每轮每种类别限一次，你使用牌结算完毕后，你可以从牌堆中检索一张基本牌或非基本牌。",
    },
};
