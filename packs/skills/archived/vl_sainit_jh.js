import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    mark: true,
    intro: {
        content: "你选择的目标为:$",
    },
    filter(event, player) {
        return game.hasPlayer(c => c != player);
    },
    async content(event, trigger, player) {
        const result = await player.chooseTarget(get.prompt2('vl_sainit_jh'), function (card, player, target) {
            return target != player
        }, true).set('ai', function () {
            return Math.random()
        }).forResult();
        if (!result.bool) return;
        game.hasPlayer(function (current) {
            if (current != player && current.hasSkill('vl_sainit_jh_draw')) {
                current.removeSkill('vl_sainit_jh_draw')
            }
        })
        const target = result.targets[0]
        target.storage.vl_sainit_jh = player
        game.hasPlayer(function (current) {
            if (current.hasSkill('vl_sainit_jh_draw')) current.removeSkill('vl_sainit_jh_draw')
        })
        target.addSkill('vl_sainit_jh_draw')
        player.storage.vl_sainit_jh = target
    },
    group: "vl_sainit_jh_discard",
    subSkill: {
        discard: {
            trigger: {
                player: ["gainAfter"],
                global: ["loseAsyncAfter"],
            },
            init(player) {
                if (!player.storage.vl_sainit_jh_count) player.storage.vl_sainit_jh_count = 0;
            },
            filter(event, player) {
                if (!event.getg?.(player)?.length) return;
                return player.countCards('h') && player.countCards('h') > player.maxHp && !player.storage.vl_sainit_yq
            },
            direct: true,
            async content(event, trigger, player) {
                await player.chooseToDiscard(player.countCards('h') - player.maxHp, true).forResult();
            },
        },
        draw: {
            trigger: {
                player: "loseAfter",
                global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"],
            },
            filter(event, player) {
                return event.getl(player)?.cards2?.length;
            },
            onremove(player) {
                player.storage.vl_sainit_jh = ''
            },
            direct: true,
            charlotte: true,
            forced: true,
            async content(event, trigger, player) {
                await player.storage.vl_sainit_jh.draw(trigger.cards.length);
            },
        },
    },
    t: {
        name: "镜华",
        info: "①回合开始时，你选择一名其他角色，直到你下次发动该技能，当该角色失去牌后，你摸等于此次失去牌数的牌；②当你的手牌数大于X时，你将手牌数弃至X（X为你体力上限）。",
    },
};
