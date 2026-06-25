import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    forced: true,
    init(player, skill) {
					player.addSkillBlocker(skill);
				},
    onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
    skillBlocker(skill, player) {
					return skill != 'vl_zhan_sf' && skill != 'vl_zhan_jf' && !lib.skill[skill].charlotte;
				},
    async content(event, trigger, player) {
        event.count = trigger.num;
        while (event.count > 0) {
        event.count--;
        					const choiceList = ['获得一张指定类型的牌'];
        					if (player.canMoveCard()) choiceList.push('移动场上的一张牌');
        					const result = await player.chooseControl(true).set('choiceList', choiceList).set('prompt', get.prompt('vl_zhan_sf')).set('ai', function () {
        						const player = _status.event.player;
        						if (player.canMoveCard(true)) return 1;
        						return 0;
        					}).forResult();
        if (result.control == 'cancel2') return;
        					else {
        						player.logSkill('vl_zhan_sf');
        						if (result.index == 0) {
        							const typeResult = await player.chooseControl('basic', 'trick', 'equip').set('prompt', '选择获得一种类型的牌').set('ai', function () {
        								const player = _status.event.player;
        								if (player.hp <= 3 && !player.countCards('h', { name: ['shan', 'tao'] })) return 'basic';
        								if (player.countCards('he', { type: 'equip' }) < 2) return 'equip';
        								return 'trick';
        							}).forResult();
        							const card = get.cardPile2(function (card) {
        								return get.type(card, 'trick') == typeResult.control;
        							});
        							if (card) await player.gain(card, 'gain2', 'log');
        						}
        						else {
        							await player.moveCard(true);
        						}
        					}
        }
    },
    group: "vl_zhan_sf_1",
    subSkill: {
        "1": {
            trigger: {
                player: "damageAfter",
            },
            forced: true,
            async content(event, trigger, player) {
							player.recover()
						},
        },
    },
    ai: {
        maixie: true,
        maixie_hp: true,
        effect: {
            target(card, player, target) {
							if (get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								let num = 1;
								if (get.attitude(player, target) > 0) {
									if (player.needsToDiscard()) {
										num = 0.7;
									}
									else {
										num = 0.5;
									}
								}
								if (target.hp >= 4) return [1, num * 2];
								if (target.hp == 3) return [1, num * 1.5];
								if (target.hp == 2) return [1, num * 0.5];
							}
						},
        },
    },
    t: {
        name: "束缚",
        info: `锁定技。①当你受到1点伤害后，你选择一项：获得牌堆里你选择的类型的一张牌，或移动场上的一张牌。②你除了${get.poptip("vl_zhan_sf")}和${get.poptip("vl_zhan_jf")}外的技能无效。③当你受到伤害结算完毕后，你回复1点体力。`,
    },
};
