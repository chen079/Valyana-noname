import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "drawAfter",
    },
    filter: function (event, player, onrewrite) {
					return player.group == 'wei' && event.player.isMaxHandcard(true) && event.player.group != player.group
				},
    direct: true,
    content: function () {
					'step 0'
					player.chooseBool('是否将势力改为与' + get.translation(trigger.player) + '相同（' + get.translation(trigger.player.group) + '）').set("ai",()=> true)
					'step 1'
					if (result.bool) {
						player.changeGroup(trigger.player.group)
					}
				},
    group: "vl_akain_bx_ice",
    subSkill: {
        ice: {
            trigger: {
                source: ["damageBefore"],
            },
            direct: true,
            filter: function (event, player) {
							return player.group == 'wei'
						},
            content: function () {
							game.setNature(trigger, 'ice');
						},
        },
    },
    t: {
        name: "冰心",
        info: "魏势力技，你造成的伤害视为冰属性。一名角色摸牌后，若其的手牌数达到全场唯一最多且与你势力不同，你可以加入其势力。",
    },
};
