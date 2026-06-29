import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["phaseAfter", "dieAfter"],
    },
    mark: true,
    intro: {
        content: `已被选为${get.poptip("vl_hars_sj")}的对象`,
    },
    lastDo: true,
    charlotte: true,
    forceDie: true,
    forced: true,
    silent: true,
    async content(event, trigger, player) {
        player.removeSkill('vl_hars_fs');
    },
    onremove(player) {
        if (player == game.me) {
            if (!game.notMe) game.swapPlayerAuto(player._trueMe)
            else delete game.notMe;
            if (_status.auto) ui.click.auto();
        }
        delete player._trueMe;
        player.setStorage('vl_hars_fs', null);
    },
    popup: false,
    t: {
        name: "附身",
        info: `锁定技，你的回合开始时，你改为由${get.poptip("vl_hars_sj")}的发动者控制。`,
    },
};
