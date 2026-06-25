import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
    },
    forced: true,
    init: function (player, skill) {
					player.addSkillBlocker(skill);
				},
    onremove: function (player, skill) {
					player.removeSkillBlocker(skill);
				},
    skillBlocker: function (skill, player) {
					return skill != 'vl_zhan_sf' && skill != 'vl_zhan_jf' && !lib.skill[skill].charlotte;
				},
    content: function () {
					'step 0'
					event.count = trigger.num;
					'step 1'
					event.count--;
					var choiceList = ['获得一张指定类型的牌'];
					if (player.canMoveCard()) choiceList.push('移动场上的一张牌');
					player.chooseControl(true).set('choiceList', choiceList).set('prompt', get.prompt('vl_zhan_sf')).set('ai', function () {
						var player = _status.event.player;
						if (player.canMoveCard(true)) return 1;
						return 0;
					});
					'step 2'
					if (result.control == 'cancel2') event.finish();
					else {
						player.logSkill('vl_zhan_sf');
						if (result.index == 0) {
							player.chooseControl('basic', 'trick', 'equip').set('prompt', '选择获得一种类型的牌').set('ai', function () {
								var player = _status.event.player;
								if (player.hp <= 3 && !player.countCards('h', { name: ['shan', 'tao'] })) return 'basic';
								if (player.countCards('he', { type: 'equip' }) < 2) return 'equip';
								return 'trick';
							});
						}
						else {
							player.moveCard(true);
							event.goto(4);
						}
					}
					'step 3'
					var card = get.cardPile2(function (card) {
						return get.type(card, 'trick') == result.control;
					});
					if (card) player.gain(card, 'gain2', 'log');
					'step 4'
					if (event.count > 0) event.goto(1);
				},
    group: "vl_zhan_sf_1",
    subSkill: {
        "1": {
            trigger: {
                player: "damageAfter",
            },
            forced: true,
            content: function () {
							player.recover()
						},
        },
    },
    ai: {
        maixie: true,
        maixie_hp: true,
        effect: {
            target: function (card, player, target) {
							if (get.tag(card, 'damage')) {
								if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
								if (!target.hasFriend()) return;
								var num = 1;
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
        info: "锁定技。①当你受到1点伤害后，你选择一项：获得牌堆里你选择的类型的一张牌，或移动场上的一张牌。②你除了「vl_zhan_sf」和「vl_zhan_jf」外的技能无效。③当你受到伤害结算完毕后，你回复1点体力。",
    },
};
