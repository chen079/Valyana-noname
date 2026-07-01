import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    intro: {
        name: "病原",
        content: "<li>每轮开始时，你令一名没有「病原」的角色获得1层「感染」，然后你摸X张牌（X为其「感染」层数）。<li>你造成伤害后，受伤角色获得1层「感染」，然后你摸X张牌（X为其「感染」层数）。<li>你对有「感染」的角色使用牌无距离限制。<li>你回复体力后，所有有「病原」的角色各摸1张牌。",
    },
    charlotte: true,
    trigger: {
        global: "roundStart",
        source: "damageSource",
        player: "recoverAfter",
    },
    forced: true,
    silent: true,
    priority: 3,
    filter(event, player, onrewrite) {
        if (!player.hasVuff("bingyuan")) return false;
        if (onrewrite == "damageSource") return event.player && event.player.isIn();
        if (onrewrite == "recoverAfter") return true;
        return game.hasPlayer(function (current) {
            return !current.hasVuff("bingyuan");
        });
    },
    async content(event, trigger, player) {
        if (event.triggername == "damageSource") {
            const target = trigger.player;
            await target.addVuff("ganran", 1, player);
            await player.draw(target.countVuffNum("ganran"));
        } else if (event.triggername == "recoverAfter") {
            const targets = game.filterPlayer(function (current) {
                return current.hasVuff("bingyuan");
            });
            if (targets.length) {
                await game.asyncDraw(targets);
            }
        } else {
            const result = await player.chooseTarget("病原：令一名没有「病原」的角色获得1层「感染」", true, function (card, player, target) {
                return !target.hasVuff("bingyuan");
            }).set("ai", function (target) {
                return -get.attitude(_status.event.player, target);
            }).forResult();
            if (result.bool) {
                const target = result.targets[0];
                await target.addVuff("ganran", 1, player);
                await player.draw(target.countVuffNum("ganran"));
            }
        }
    },
    mod: {
        targetInRange(card, player, target) {
            if (player.hasVuff("bingyuan") && target.hasVuff("ganran")) return true;
        },
    },
    vuffInfo: {
        naturalLose: false,
        type: 'devuff',
        limit: 1,
        vuffRank: {
            basic: [0, 2],
        },
        vuffReject: ['ganran'],
    },
};
