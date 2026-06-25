import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBefore",
        player: ["phaseBegin", "enterGame"],
    },
    forced: true,
    filter: function (event, player,name) {
					if(name != "phaseBegin"){
						if(!(event.name != "phase" || game.phaseNumber == 0))return;
					}
					if (!lib.inpile.includes('fr_equip5_wxpp')) return true;
					return !!get.cardPile(function (card) {
						return card.name == 'fr_equip5_wxpp';
					});
				},
    content: function () {
					var card;
					if (!lib.inpile.includes('fr_equip5_wxpp')) {
						card = game.createCard2('fr_equip5_wxpp', 'diamond', 1);
						lib.inpile.push('fr_equip5_wxpp');
					}
					else card = get.cardPile(function (card) {
						return card.name == 'fr_equip5_wxpp';
					});
					player.chooseUseTarget(card, true, 'nopopup');
				},
    group: "vl_liya_yy_damage",
    subSkill: {
        damage: {
            trigger: {
                player: "damageEnd",
            },
            forced: true,
            filter: function (event, player) {
							return !player.getEquip('fr_equip5_wxpp');
						},
            content: function () {
							'step 0'
							event.count = trigger.num;
							'step 1'
							event.count--;
							player.draw();
							'step 2'
							var card = get.cardPile2(function (card) {
								return get.subtype(card, false) == 'equip1' && player.canUse(card, player);
							});
							if (card) player.chooseUseTarget(card, true, 'nopopup');
							'step 3'
							if (event.count > 0 && !player.getEquip('fr_equip5_wxpp')) event.goto(1);
						},
            sub: true,
        },
    },
    t: {
        name: "乐音",
        info: "锁定技，游戏开始或回合开始时，若「fr_equip5_wxpp」未加入游戏或在牌堆/弃牌堆内，则你使用之；当你受到1点伤害后，若你的装备区里没有「fr_equip5_wxpp」，则你摸一张牌并使用牌堆中的一张随机武器牌。",
    },
};
