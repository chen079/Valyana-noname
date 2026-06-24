import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
export default {
    trigger: {
        player: "damageBegin3",
        source: "damageBegin1",
    },
    log: false,
    t: {
        name: '戏命',
        info: '锁定技，你造成与受到的伤害+1。你的【杀】指定目标后，该角色的非锁定技失效直到本回合结束。',
        taici: ['你的性命，不过是我的玩物', '性命攸关，于我无非游戏']
    },
    forced: true,
    content() {
        trigger.num += 1;
    },
    ai: {
        threaten: 10,
    },
    group: ["vl_ximing_lock"],
    subSkill: {
        lock: {
            forced: true,
            async content(event, trigger, player) {
                const target = trigger.target;
                target.addTempSkill('fengyin');
            },
            ai: {
                ignoreSkill: true,
                "directHit_ai": true,
                skillTagFilter(player, tag, arg) {
                    if (!arg?.target) return false;
                    const target = arg.target;
                    if (tag === 'directHit_ai') {
                        return get.attitude(player, target) <= 0 && arg.card && arg.card.name === 'sha' && ui.cardPile.firstChild && get.color(ui.cardPile.firstChild, player) === 'red';
                    }
                    if (!arg.skill) return false;
                    const skill = arg.skill, info = lib.skill[skill];
                    return info && !info.charlotte && !info.persevereSkill && !get.is.locked(skill, arg.target) && target.getSkills(true, false).includes(skill);
                },
            },
            trigger: {
                player: "useCardToPlayered",
            },
            check(event, player) {
                return get.attitude(player, event.target) <= 0;
            },
            filter(event, player) {
                return event.card.name === 'sha';
            },
            logTarget: "target",
            preHidden: true,
            "_priority": 0,
        }
    }
}