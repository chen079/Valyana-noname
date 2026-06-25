import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    inherit: "tiandu",
    trigger: {
        player: "judgeEnd",
    },
    preHidden: true,
    frequent: function (event) {
					if (event.result.card.name == 'du') return false;
					//if(get.mode()=='guozhan') return false;
					return true;
				},
    check: function (event) {
					if (event.result.card.name == 'du') return false;
					return true;
				},
    filter: function (event, player) {
					return event.result && event.result.card && get.position(event.result.card, true) == 'o';
				},
    content: function () {
					player.gain(trigger.result.card, 'gain2');
				},
    t: {
        name: "天妒",
        info: "你的判定牌生效后，你可以获得此牌。",
    },
};
