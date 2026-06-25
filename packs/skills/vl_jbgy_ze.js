import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    filter: function (event, player) {
					return player.countMark('vl_jbgy_ze') >= player.hp
				},
    direct: true,
    mark: true,
    init: function (player, storage) {
					player.storage.vl_jbgy_ze = 0
				},
    intro: {
        content: "本回合已造成$点伤害",
    },
    content: function () {
					"step 0"
					player.recover()
					if (game.hasPlayer(function (current) {
						return current.countGainableCards(player, 'ej') > 0;
					})) {
						player.chooseTarget('请选择一名角色，获得其装备区或判定区内的一张牌', true, function (card, player, target) {
							return target.countGainableCards(player, 'ej') > 0;
						}).set('ai', function (target) {
							var player = _status.event.player;
							var att = get.attitude(player, target);
							if (att > 0 && target.countCards('ej', function (card) {
								return get.position(card) == 'j' || get.value(card, target) <= 0;
							})) return 2 * att;
							else if (att < 0 && target.countCards('e', function (card) {
								return get.value(card, target) > 5;
							})) return -att;
							return -1;
						});
					}
					"step 1"
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill('vl_jbgy_ze', target);
						player.gainPlayerCard(target, 'ej', true);
					}
				},
    group: ["vl_jbgy_ze_damage", "vl_jbgy_ze_count", "vl_jbgy_ze_clean"],
    subSkill: {
        damage: {
            trigger: {
                player: "damageBefore",
            },
            filter: function (event, player) {
							return event.source && event.source != player
						},
            forced: true,
            content: function () {
							trigger.source = player
						},
            sub: true,
        },
        count: {
            trigger: {
                source: "damageSource",
            },
            forced: true,
            content: function () {
							player.addMark('vl_jbgy_ze')
						},
            sub: true,
        },
        clean: {
            trigger: {
                global: "phaseAfter",
            },
            firstDo: true,
            popup: false,
            forced: true,
            content: function () {
							var num = player.countMark('vl_jbgy_ze')
							player.removeMark('vl_jbgy_ze', num)
						},
            sub: true,
        },
    },
    t: {
        name: "诛恶",
        info: "锁定技，其他角色对你造成伤害前，将伤害来源改为你；回合结束时，若你于本回合内造成的伤害不小于你的体力值，你回复1点体力并获得场上一张牌。",
    },
};
