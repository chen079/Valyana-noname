import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    enable: "chooseToUse",
    mark: true,
    skillAnimation: true,
    limited: true,
    animationColor: "orange",
    init(player) {
        player.setStorage('vl_francium_mm', false);
    },
    filter(event, player) {
        if (player.getStorage('vl_francium_mm', false)) return false;
        if (event.type == 'dying') {
            if (player != event.dying) return false;
            return true;
        }
        return false;
    },
    async content(event, trigger, player) {
        player.awakenSkill('vl_francium_mm');
        if (player.hp < 2) {
            await player.recover(2 - player.hp);
        }
        player.removeSkill('vl_francium_ch')
    },
    ai: {
        order: 1,
        skillTagFilter(player, arg, target) {
            if (player != target || player.getStorage('vl_francium_mm', false)) return false;
        },
        save: true,
        result: {
            player(player) {
                if (player.hp <= 0) return 10;
                if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
                return 0;
            },
        },
        threaten(player, target) {
            if (!target.getStorage('vl_francium_mm', false)) return 0.6;
        },
    },
    intro: {
        content: "limited",
    },
    t: {
        name: "明灭",
        info: `限定技，当你进入濒死状态时，你可以将体力值回复至2点并失去技能${get.poptip("vl_francium_ch")}。`,
    },
};
