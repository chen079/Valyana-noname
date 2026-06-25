import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "dying",
    },
    filter(event, player) {
					return event.player.hp < 1;
				},
    limited: true,
    skillAnimation: true,
    animationColor: "gray",
    logTarget: "player",
    check(event, player) {
					if (get.attitude(player, event.player) < 4) return false;
					return true;
				},
    async content(event, trigger, player) {
player.awakenSkill('vl_west_sx');
        					await trigger.player.gainMaxHp();
//var num=Math.min(5,trigger.player.maxHp);
        					await trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
        					//if(trigger.player.countCards("h")<=num) trigger.player.draw(num-trigger.player.countCards("h"));
        					//else trigger.player.chooseToDiscard("h",true,trigger.player.countCards("h")-num);
trigger.player.link(false);
        					trigger.player.turnOver(false);
trigger.player.disableJudge();
var num = trigger.player.countDisabled();
        					if (num) {
        						for (var i = 1; i < 6; i++) {
        							if (trigger.player.isDisabled(i)) trigger.player.enableEquip(i);
        						}
        					}
var num = trigger.player.maxHp - trigger.player.countCards('h')
        					if (num > 0) { await trigger.player.draw(num) }
    },
    mark: true,
    intro: {
        content: "limited",
    },
    init(player, skill) {
					player.storage[skill] = false;
				},
    t: {
        name: "圣洗",
        info: "限定技，当一名角色进入濒死状态时，你可令其依次执行以下所有项：①加1点体力上限；②回复所有体力；③复原武将牌；④废除判定区；⑤复原所有装备栏。⑥将手牌摸至与体力上限相等。",
    },
};
