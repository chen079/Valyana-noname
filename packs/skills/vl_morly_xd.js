import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    check(event, player) {
					return get.attitude(player, event.player) <= 0;
				},
    logTarget: "player",
    filter(event, player) {
					return player != event.player && lib.linked.includes(event.nature);
				},
    async content(event, trigger, player) {
						if (trigger.player.countCards('h') == 0) {
							trigger.num += 1
							return
						}
						const result = await player.chooseControl("选项一", "选项二").set("prompt", "请选择发动的选项：").set('choiceList', ['观看并获得该角色的X张牌', '令此次属性伤害值+1']).set("ai", function () {
							if (trigger.player.countCards('h') == 1) return 0
							if (trigger.player.countCards('h') == trigger.num && trigger.player.hp > trigger.num + 1 && trigger.num == 1) return 0
							if (trigger.player.hp < trigger.num + 1) return 1
							return 1
						}).forResult();
						const target = trigger.player;
						const num = trigger.num;
						if (result.index == 0) {
							await player.gainPlayerCard(num, 'h', target, true, 'visible')
						}
						else {
							trigger.num += 1
						}
    },
    t: {
        name: "袭敌",
        info: "当你对其他角色造成属性伤害时，你可以选择一项：1.观看并获得其X张手牌（X为此次伤害值），2.令此次属性伤害值+1。",
    },
};
