import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    frequent: true,
    filter: function (eveny, player) {
					return player.getExpansions('vl_knier_wh').length > 0
				},
    content: function () {
					"step 0"
					player.chooseCardButton('选择一张牌', 1, player.getExpansions('vl_knier_wh')).set('prompt2', "是否将一张“雾花”当作【出其不意】使用").set("ai", ai = function (button) {
						return 9 - get.value(button.link);
					})
					"step 1"
					if (result.bool) {
						var card = result.links
						player.chooseUseTarget('将一张“雾花”当作【出其不意】使用', card, { name: 'chuqibuyi' }, false).viewAs = true;
					}
				},
    t: {
        name: "海平",
        info: "准备阶段，你可以将你的一张“雾花”当作【出其不意】使用。",
    },
};
