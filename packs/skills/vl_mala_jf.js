import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "loseMaxHpBegin",
    },
    forced: true,
    charlotte: true,
    supercharlotte: true,
    async content(event, trigger, player) {
        trigger.finish()
        trigger.cancel()
        var num = player.maxHp
        player.gainMaxHp(num)
        player.recover(num)
    },
    t: {
        name: "解放",
        info: "锁定技，当你失去体力上限时，你取消之，然后你获得X点体力上限并回复X点体力（X为你当前的体力上限）。",
    },
};
