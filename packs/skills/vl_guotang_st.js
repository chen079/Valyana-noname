import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    skillAnimation: "epic",
    animationColor: "fire",
    limited: true,
    enable: "phaseUse",
    async content(event, trigger, player) {
        player.awakenSkill('vl_guotang_st');
        player.storage.vl_guotang_yl.sortBySeat();
        const targets = player.storage.vl_guotang_yl.slice(0);
        for (const target of targets) {
            target.recover();
            const h = target.countCards('h');
            const num = Math.min(5 - h, target.maxHp - h);
            if (num > 0) await target.draw(num);
        }
        if (game.dead.length == 0) {
            player.addTempSkill('vl_guotang_st_1');
        }
    },
    subSkill: {
        "1": {
            trigger: {
                player: "phaseEnd",
            },
            direct: true,
            filter(event, player) {
                return player.storage.vl_guotang_yl.length
            },
            content: async function content(event, trigger, player) {
                const result = await player.chooseTarget('令一名角色摸三张牌，并执行一个额外的回合', 1).set('ai', function (target) {
                    let source = _status.event.player;
                    return get.attitude(source, target);
                }).set('filterTarget', function (card, player, target) {
                    return player.storage.vl_guotang_yl.includes(target);
                }).forResult();
                if (result.bool) {
                    const target = result.targets[0];
                    await target.draw(3);
                    target.insertPhase();
                }
            },
        },
    },
    ai: {
        expose: 0.3,
        order: 1,
        result: {
            player(player, target) {
                if (player.storage.vl_guotang_yl.length < 3) return 0
                return 1
            },
            target: 1,
        },
    },
    t: {
        name: "兽土",
        info: "限定技，出牌阶段，你可以发动此技能。你令所有成为过“永良”目标的角色回复1点体力，并将手牌摸至体力上限（至多摸至5），若此时场上没有角色死亡，则回合结束后，你可令其中一名角色摸三张牌，并执行一个额外的回合。",
    },
};
