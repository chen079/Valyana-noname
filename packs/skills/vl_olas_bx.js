import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    forced: true,
    filter: function (event, player) {
					return event.player != player && event.getParent().name == 'sha'
				},
    content: function () {
					var cards = trigger.player.getCards('h', 'sha')
					if(!cards.length)return;
					player.gain(cards, 'gain2')
				},
    t: {
        name: "缴械",
        info: "锁定技，当你因执行【杀】的效果对一名其他角色造成伤害时，你获得该角色的所有【杀】。",
    },
};
