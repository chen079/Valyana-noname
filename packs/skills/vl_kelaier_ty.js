import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
					return player != target
				},
    filterCard: true,
    position: "he",
    filter(event, player) {
					return player.countCards('he') > 0
				},
    async content(event, trigger, player) {
const result = await player.judge().forResult()
switch (get.color(result.card)) {
        						case 'red': target.storage.tyname = 'basic'; break;
        						case 'black': target.storage.tyname = 'trick'; break;
        					}
        					target.addTempSkill("vl_kelaier_ty_1", { player: "phaseAfter" })
    },
    ai: {
        order: 10,
        result: {
            player: 1,
            target(player, target) {
							if (target.countCards('h') > target.hp) return target.hp - target.countCards('h');
							return -2;
						},
        },
        threaten: 0.5,
    },
    subSkill: {
        "1": {
            mod: {
                cardEnabled(card, player) {
								if (get.type2(card) == player.storage.tyname) return false;
							},
                cardSavable(card, player) {
								if (get.type2(card) == player.storage.tyname) return false;
							},
            },
            intro: {
                content(storage, player, skill) {
								return "你不能使用" + get.translation(player.storage.tyname) + '牌'
							},
            },
            mark: true,
            sub: true,
        },
    },
    t: {
        name: "同弈",
        info: "出牌阶段限一次，你可以弃置一张手牌并选择一名其他角色，然后进行一次判定。直到该角色回合结束，若结果为红色，该角色不能使用基本牌，若结果为黑色，该角色不能使用锦囊牌。",
    },
};
