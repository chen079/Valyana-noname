import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return player.countCards('h') > 0
				},
    filterTarget: true,
    filterCard: true,
    content: function () {
					"step 0"
					player.judge()
					"step 1"
					switch (result.color) {
						case "red": target.recover(1); target.addTempSkill("vl_kelaier_dh_2", { player: "phaseUseBefore" }); break;
						case "black": target.draw(2); target.addTempSkill("vl_kelaier_dh_1", { player: "phaseUseBefore" }); break;
					}
				},
    order: 9,
    result: {
        target: function (player, target) {
						return 2 / Math.max(1, Math.sqrt(target.hp));
					},
    },
    subSkill: {
        "1": {
            forced: true,
            init: function (player) {
							player.changeHujia(1,null,true);
						},
            charlotte: true,
            onremove: function (player) {
							player.changeHujia(-1);
						},
            intro: {
                content: "你区域内的♠都视为♣",
            },
            mark: true,
            mod: {
                suit: function (card, suit) {
								if (suit == 'spade') return 'club';
							},
            },
            sub: true,
        },
        "2": {
            forced: true,
            charlotte: true,
            init: function (player) {
							player.changeHujia(1,null,true);
						},
            onremove: function (player) {
							player.changeHujia(-1);
						},
            intro: {
                content: "你区域内的♦都视为♥",
            },
            mark: true,
            mod: {
                suit: function (card, suit) {
								if (suit == 'diamond') return 'heart';
							},
            },
            sub: true,
        },
    },
    t: {
        name: "定花",
        info: "出牌阶段限一次，你可以弃置一张牌并选择一名角色，然后进行判定。若如此做，直到其下个出牌阶段开始前，该角色获得1点护甲。若判定结果为黑色，该角色摸两张牌，然后直到其下个出牌阶段开始前，其区域内所有的♠都视为♣；若结果为红色，该角色回复1点体力，然后直到其下个出牌阶段开始前，其区域内所有的♦都视为♥。",
    },
};
