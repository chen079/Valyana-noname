import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    lose: false,
    discard: false,
    delay: false,
    selectCard() {
        let player = _status.event.player
        return Math.floor(player.countCards('h') / 2)
    },
    filter(event, player) {
        if (Math.floor(player.countCards('h') / 2) <= 0) return false
        if (!player.storage.vl_hars_sj) return true;
        return game.hasPlayer(function (current) {
            return current != player && !player.storage.vl_hars_sj.includes(current);
        });
    },
    init(player) {
        if (!player.storage.vl_hars_sj) player.storage.vl_hars_sj = [];
    },
    filterTarget(card, player, target) {
        return target != player && (!player.storage.vl_hars_sj || !player.storage.vl_hars_sj.includes(target));
    },
    content: async function content(event, trigger, player) {
        const target = event.target;
        await player.give(event.cards, target);
        target.addSkill("vl_hars_fs");
        if (!player.storage.vl_hars_sj) player.storage.vl_hars_sj = [];
        player.storage.vl_hars_sj[0] = target;
        player.markSkill('vl_hars_sj');
    },
    intro: {
        content: "上回合已对$发动过〖神降〗",
    },
    ai: {
        order(card, player) {
            let num = Math.min(...player.getCards("h").map(c => get.order(c)));
            return Math.max(1, num);
        },
        result: {
            target(player, target) {
                return -1;
            },
        },
    },
    group: "vl_hars_sj_fs",
    subSkill: {
        fs: {
            forced: true,
            trigger: {
                global: "phaseBeginStart",
            },
            charlotte: true,
            filter(event, player) {
                return player != event.player && !event.player._trueMe && event.player.hasSkill("vl_hars_fs");
            },
            logTarget: "player",
            skillAnimation: true,
            animationColor: "key",
            async content(event, trigger, player) {
                trigger.player._trueMe = player;
                game.addGlobalSkill('autoswap');
                if (trigger.player == game.me) {
                    game.notMe = true;
                    if (!_status.auto) ui.click.auto();
                }
            },
        },
    },
    t: {
        name: "神降",
        info: "出牌阶段限一次，你可以交给一名其他角色一半的手牌（至少一张且向下取整），若如此做，该角色回合开始时，改为你操控（你不能连续选择同一角色）。",
    },
};
