import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
    },
    init: function (player) {
				},
    mark: true,
    intro: {
        content: "每轮开始时你将手牌调整至体力上限然后隐匿。",
    },
    forced: true,
    content: function () {
					"step 0"
					var num = player.maxHp - player.countCards('h')
					if (num > 0) {
						player.draw(num)
					} else if (num < 0) {
						player.chooseToDiscard(-num, 'h', true)
					}
					"step 1"
					player.unmarkSkill('vl_jet_fy_mark')
					player.hideCharacter(1)
					if (player.name2) player.hideCharacter(2)
				},
    t: {
        name: "拂衣",
        info: "锁定技，每轮开始时，你将手牌数调整至体力上限并隐匿。",
    },
};
