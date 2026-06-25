import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["chooseToRespondBegin", "chooseToUseBegin"],
    },
    unique: true,
    zhuSkill: true,
    filter: function (event, player) {
					if (event.responded) return false;
					if (!event.filterCard({ name: 'shan' }, player, event)) return false;
					return player.isMinHandcard() || player.isMinHp()
				},
    frequent: true,
    usable: 1,
    content: function () {
					"step 0"
					trigger.untrigger();
					trigger.responded = true;
					trigger.result = { bool: true, card: { name: 'shan' } }
				},
    ai: {
        respondShan: true,
        effect: {
            target: function (card, player, target, effect) {
							if (get.tag(card, 'respondShan') && effect < 0) {
								if (target.countCards('h') >= 2) return 0.5;
							}
						},
        },
    },
    t: {
        name: "政变",
        info: "主公技。每回合限一次，当你需要使用或打出一张【闪】时，若你的手牌数或体力值为全场最少，你可以视为使用或打出之。",
    },
};
