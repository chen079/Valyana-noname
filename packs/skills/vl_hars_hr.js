import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    global: "vl_hars_hr_gola",
    trigger: {
        target: "useCardToTargeted",
    },
    check(event, player) {
        return get.effect(player, event.card, event.player, player) < 0;
    },
    filter(event, player) {
        return (event.card.name == 'sha' || (get.type(event.card) == 'trick' && get.tag(event.card, 'damage'))) && event.player != player;
    },
    frequent: true,
    logTarget: "player",
    async content(event, trigger, player) {
        const result = await trigger.player.chooseBool('是否令此牌对' + get.translation(player) + '无效，并令其摸两张牌').set('ai', function () {
            let source = _status.event.player;
            let target = _status.event.target;
            return get.attitude(source, target) > 0 && get.effect(target, trigger.card, source, target) < 0;
        }).set('target', player).forResult();
        if (result.bool) {
            trigger.excluded.add(player);
            await player.draw(2);
        }
    },
    subSkill: {
        gola: {
            enable: "phaseUse",
            filter(event, player) {
                return game.hasPlayer(function (current) {
                    return current != player && current.hasSkill('vl_hars_hr');
                });
            },
            filterTarget(card, player, target) {
                return player != target && target.hasSkill('vl_hars_hr');
            },
            lose: false,
            discard: false,
            delay: false,
            check(card) {
                return 8 - get.value(card)
            },
            filterCard: true,
            selectCard: [1, 2],
            usable: 1,
            prompt: "出牌阶段限一次，你可以交给拥有技能【浩然】的角色至多两张牌。",
            async content(event, trigger, player) {
                const result = await player.chooseCardTarget({
                    filterTarget(card, player, target) {
                        return player != target && target.hasSkill('vl_hars_hr');
                    },
                    selectTarget: 1,
                    filterCard: true,
                    selectCard: [1, 2],
                    prompt: "出牌阶段限一次，你可以交给拥有技能【浩然】的角色至多两张牌。",
                    ai1(card) {
                        return 8 - get.value(card);
                    },
                    ai2(target) {
                        return get.attitude(player, target);
                    },
                }).forResult();
                if (!result.bool) return;
                await result.targets[0].gain(result.cards, player, 'giveAuto');
            },
            ai: {
                order: 10,
                expose: 0.2,
                result: {
                    player(player, target) {
                        const bystander = game.findPlayer(function (current) {
                            return current.hasSkill('bolan');
                        });
                        if (bystander) {
                            return get.attitude(player, bystander);
                        }
                    },
                },
            },
        },
    },
    t: {
        name: "浩然",
        info: "当你成为其他角色【杀】或伤害类锦囊牌的目标后，其可以令此牌对你无效并令你摸两张牌。其他角色的出牌阶段限一次，其可以交给你至多两张牌。",
    },
};
