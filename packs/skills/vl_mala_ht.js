import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        targetInRange: function (card, player, target) {
						return true;
					},
        cardUsable: function (card, player, num) {
						return Infinity
					},
        selectTarget: function (card, player, range) {
						if (range[0] != 1 || range[1] != 1) return;
						var range2 = get.select(get.info(card)?.selectTarget);
						if (range2[0] != 1 && range2[1] != 1) return;
						if (card.name == 'sha' || get.type(card) == 'trick') range[1] = (1 + player.getDamagedHp());
					},
    },
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    forced: true,
    filter: function (event, player) {
					return player.countCards('j') > 0
				},
    content: function () {
					player.discard(player.getCards('j').randomGet());
				},
    t: {
        name: "宏腾",
        info: "锁定技，你使用牌无距离与次数限制，且你的单体锦囊牌与【杀】可以多指定X个目标（X为你的已损体力值）；准备阶段，你随机失去一张判定区内的牌。",
    },
};
