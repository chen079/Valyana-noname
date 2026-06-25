import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["phaseAfter", "dieAfter"],
    },
    mark: true,
    intro: {
        content: "已被选为〖神降〗的对象",
    },
    lastDo: true,
    charlotte: true,
    forceDie: true,
    forced: true,
    silent: true,
    content: function () {
					player.removeSkill('vl_hars_fs');
				},
    onremove: function (player) {
					if (player == game.me) {
						if (!game.notMe) game.swapPlayerAuto(player._trueMe)
						else delete game.notMe;
						if (_status.auto) ui.click.auto();
					}
					delete player._trueMe;
				},
    popup: false,
    t: {
        name: "附身",
        info: "锁定技，你的回合开始时，你改为由〖神降〗的发动者控制。",
    },
};
