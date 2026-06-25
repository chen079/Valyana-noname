import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBefore",
    },
    forced: true,
    direct: true,
    filter(event, player) {
					return event.player.hujia > 0
				},
    content: async function content(event, trigger, player) {
					await trigger.player.changeHujia(-trigger.player.hujia);
					await trigger.player.draw(trigger.player.hujia);
				},
    group: ["vl_yinhu_sp_1", "vl_yinhu_sp_2"],
    subSkill: {
        "1": {
            mod: {
                targetEnabled(card, player, target) {
								if (get.type(card) == 'delay') {
									return false;
								}
							},
            },
            trigger: {
                player: ["phaseZhunbeiBefore", "phaseJieshuBefore"],
            },
            forced: true,
            async content(event, trigger, player) {
							trigger.cancel();
							game.log(player, '跳过了', event.triggername == 'phaseZhunbeiBefore' ? '准备阶段' : '结束阶段');
						},
            sub: true,
        },
        "2": {
            popup: false,
            trigger: {
                player: "phaseJudgeBefore",
            },
            forced: true,
            async content(event, trigger, player) {
							trigger.cancel();
							game.log(player, '跳过了判定阶段');
						},
            sub: true,
        },
    },
    t: {
        name: "识破",
        info: "锁定技，你始终跳过准备阶段，判定阶段，结束阶段。你不能成为延时锦囊牌的目标。当你对其他角色造成伤害前，其失去所有护甲并摸等量的牌。",
    },
};
