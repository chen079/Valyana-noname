import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "chooseToUse",
    filter(event, player) {
					return player.countCards('hs', { color: 'black' }) > 0;
				},
    position: "hs",
    filterCard(card) {
					return get.color(card) == 'black';
				},
    viewAs: {
        name: "tiesuo",
    },
    prompt: "将一张黑色牌当铁锁连环使用",
    check(card) { return 4.5 - get.value(card) },
    ai: {
        basic: {
            order: 7,
            useful: 4,
            value: 4,
        },
        wuxie(target, card, player, viewer) {
						if (target.hasSkillTag('nodamage') || target.hasSkillTag('nofire') || target.hasSkillTag('nothunder') || _status.event.getRand() < 0.5 || get.attitude(viewer, player) > 0) return 0;
					},
        result: {
            target(player, target) {
							if (target.hasSkillTag('link')) return 0;
							let curs = game.filterPlayer(function (current) {
								if (current.hasSkillTag('nodamage')) return false;
								return !current.hasSkillTag('nofire') || !current.hasSkillTag('nothunder');
							});
							if (curs.length < 1) return 0;
							let f = target.hasSkillTag('nofire'),
								t = target.hasSkillTag('nothunder'),
								res = 0.9;
							if ((f && t) || target.hasSkillTag('nodamage')) return 0;
							if (f || t) res = 0.45;
							if (target.getEquip('tengjia')) res *= 2;
							if (!target.isLinked()) res = -res;
							if (ui.selected.targets.length) return res;
							let fs = 0,
								es = 0,
								att = get.attitude(player, target),
								linkf = false,
								alink = true;
							for (let i of curs) {
								let atti = get.attitude(player, i);
								if (atti > 0) {
									fs++;
									if (i.isLinked()) linkf = true;
								}
								if (atti < 0) {
									es++;
									if (!i.isLinked()) alink = false;
								}
							}
							if (es == 1 && !alink) {
								if (att <= 0 || (att > 0 && linkf && fs <= 1)) return 0;
							}
							return res;
						},
        },
        tag: {
            multitarget: 1,
            multineg: 1,
            norepeat: 1,
        },
    },
    _priority: 0,
    group: "vl_kulun_metal_zl_discard",
    subSkill: {
        discard: {
            trigger: {
                global: "linkBefore",
            },
            direct: true,
            filter(event, player) {
							return event.player.isLinked() && game.hasPlayer(current => current.countCards('he') > 0
								&& (current == event.player.previous || current == event.player.next));
						},
            async content(event, trigger, player) {
const result = await player.chooseTarget(get.prompt2('vl_kulun_metal_zl'), 1, true, function (card, player, target) {
        								return target == trigger.player.next || target == trigger.player.previous
        							}).set('ai', function (target) {
        								return -get.attitude(player, target)
        							}).forResult()
await player.discardPlayerCard(result.targets[0], true, 'he')
    },
        },
    },
    t: {
        name: "链结",
        info: "出牌阶段，你可以将一张黑色牌当【铁索连环】使用。一名角色重置武将牌后，你弃置其上家或下家一张牌。",
    },
};
