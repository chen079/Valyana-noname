import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: "vl_sam_wh_2",
    trigger: {
        player: "useCardToPlayered",
    },
    logTarget: "target",
    forced: true,
    filter: function (event, player) {
					if (event.target == player) return false;
					if (event.target.hasSkill("baiban") && event.target.hasSkill("vl_sam_wh_1")) return false;
					return get.tag(event.card, 'damage');
				},
    content: function () {
					trigger.target.addTempSkill("baiban");
					trigger.target.addTempSkill("vl_sam_wh_1");
				},
    subSkill: {
        "1": {
            charlotte: true,
            ai: {
                unequip2: true,
            },
            sub: true,
        },
        "2": {
            usable: 1,
            forced: true,
            trigger: {
                source: "damageSource",
            },
            content: function () {
							"step 0"
							player.addTempSkill("vl_sam_wh_3");
							"step 1"
							player.draw(2);
						},
            sub: true,
        },
        "3": {
            mod: {
                cardUsable: function (card, player, num) {
								if (card.name == 'sha') return num + 1;
							},
                targetInRange: function (card) {
								if (card.name == 'sha') return true;
							},
            },
            sub: true,
        },
    },
    t: {
        name: "怒威",
        info: "锁定技，当你使用带伤害标签的牌指定其他角色为目标后，你令其防具和技能失效直至此回合结束。每回合限一次，当你造成伤害后，你摸两张牌，然后此回合你使用【杀】无距离限制且次数上限+1。",
    },
};
