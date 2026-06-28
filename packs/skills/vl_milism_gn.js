import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    trigger: {
        player: "damageEnd",
    },
    async content(event, trigger, player) {
        const next = player.chooseTarget('令一名角色摸2X张牌（X为此次伤害值）');
        const recode = player.getStorage('vl_milism_th_recode', []);
        if (recode.length) {
            next.set('prompt2', '（若目标为' + get.translation(recode) + '则改为摸3X张牌）');
        }
        next.set('ai', function (target) {
            let player = _status.event.player;
            let att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
            if (target.hasSkillTag('nogain')) att /= 10;
            if (player.getStorage('vl_milism_th_recode', []).includes(target)) return att * 2;
            return att;
        });
        const result = await next.forResult();
        if (result.bool) {
            const target = result.targets[0];
            player.line(target, 'green');
            if (player.getStorage('vl_milism_th_recode', []).includes(target)) {
                await target.draw(3 * trigger.num);
            } else {
                await target.draw(2 * trigger.num);
            }
        }
    },
    ai: {
        maixie: true,
    },
    t: {
        name: "共难",
        info: "当你受到伤害后，你可以令一名角色摸2X张牌，若其为〖同游〗指定的角色，则改为摸3X张牌（X为此次伤害值）。",
    },
};
