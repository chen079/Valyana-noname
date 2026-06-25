import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    inherit: "tiandu",
    trigger: {
        player: "judgeEnd",
    },
    preHidden: true,
    frequent(event) {
					if (event.result.card.name == 'du') return false;
					//if(get.mode()=='guozhan') return false;
					return true;
				},
    check(event) {
					if (event.result.card.name == 'du') return false;
					return true;
				},
    filter(event, player) {
					return event.result && event.result.card && get.position(event.result.card, true) == 'o';
				},
    async content(event, trigger, player) {
					player.gain(trigger.result.card, 'gain2');
				},
    t: {
        name: "天妒",
        info: "你的判定牌生效后，你可以获得此牌。",
    },
};
