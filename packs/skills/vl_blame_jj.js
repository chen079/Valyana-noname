import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    unique: true,
    enable: "phaseUse",
    skillAnimation: true,
    animationColor: "gray",
    filterTarget: function (card, player, target) {
					return target != player;
				},
    filter: function (event, player) {
					return !player.isDisabled('equip1') && !player.isDisabled('equip2') && !player.isDisabled('equip2') && !player.isDisabled('equip4') && !player.isDisabled('equip5')
				},
    content: function () {
					var cards = player.getCards('e')
					player.gain(cards, 'gain2')
					player.disableEquip('equip1');
					player.disableEquip('equip2');
					player.disableEquip('equip3');
					player.disableEquip('equip4');
					player.disableEquip('equip5');
					player.addTempSkill('vl_blame_jj_1');
					player.storage.vl_blame_jj_1 = target;
					target.addSkill('vl_blame_jj_2');
					target.markSkillCharacter('vl_blame_jj_1', player, '剑祭', '无法使用或打出任何手牌');
				},
    group: "vl_blame_jj_3",
    subSkill: {
        "1": {
            onremove: function (player) {
							player.storage.vl_blame_jj_1.removeSkill('vl_blame_jj_2');
							player.storage.vl_blame_jj_1.unmarkSkill('vl_blame_jj_1');
							delete player.storage.vl_blame_jj_1;
						},
            mod: {
                targetInRange: function (card, player, target) {
								if (target.hasSkill('vl_blame_jj_2')) {
									return true;
								}
							},
                cardname: function (card, player) {
								if (get.type(card, null, false) == 'equip') return 'sha';
							},
                cardUsableTarget: function (card, player, target) {
								if (target.hasSkill('vl_blame_jj_2')) return true;
							},
            },
            charlotte: true,
        },
        "2": {
            mod: {
                cardEnabled2: function (card, player) {
								if (get.position(card) == 'h') return false;
							},
            },
            ai: {
                effect: {
                    target: function (card, player, target) {
									if (get.tag(card, 'damage')) return [0, -999999];
								},
                },
            },
            charlotte: true,
        },
        "3": {
            trigger: {
                global: "phaseUseBegin",
            },
            direct: true,
            filter: function (event, player) {
							return event.player != player && event.player.countCards('h') > player.countCards('h') && player.countDisabled() > 0
						},
            content: function () {
							player.draw(trigger.player.countCards('h') - player.countCards('h'))
							player.chooseToEnable();
						},
        },
    },
    ai: {
        order: 13,
        result: {
            target: function (player, target) {
							if (target.getEquip('bagua') || target.getEquip('rewrite_bagua')) return 0;
							var hs = player.countCards('h', function (card) {
								return ['sha', 'juedou'].includes(card.name) && get.effect(target, card, player, player) != 0;
							});
							var ts = target.hp;
							if (hs >= ts && ts > 1) return -1;
							return 0;
						},
        },
    },
    t: {
        name: "剑祭",
        info: "出牌阶段，若你的装备区均未被废除，你可以获得你的所有装备区的牌并废除你的装备区，然后指定一名其他角色。直到回合结束，你对其使用牌无距离和次数限制且你的装备牌均视为【杀】，其不能使用和打出手牌。其他角色的出牌阶段开始时，若其手牌数大于你且你有被废除的区域，你摸至与其手牌数相同然后你可以恢复你的一个被废除区域。",
    },
};
