import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mark: true,
    popup: false,
    trigger: {
        target: "useCardToTargeted",
    },
    onremove: true,
    intro: {
        content: "已记录牌名：$",
    },
    filter: function (event, player) {
					return get.type2(event.card) == 'trick' && _status.currentPhase != player
				},
    check: function (event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
    content: function () {
					'step 0'
					player.judge('vl_crow_my', function (card) { return (get.suit(card) != 'spade') ? 1.5 : -0.5 }).judge2 = function (result) {
						return result.bool;
					};
					'step 1'
					if (result.judge > 0) {
						player.markAuto('vl_crow_my', [trigger.card.name])
						trigger.targets.remove(player);
						trigger.getParent().triggeredTargets2.remove(player);
						trigger.untrigger();
					}
				},
    ai: {
        effect: {
            target: function (card, player, target, current) {
							if (get.type(card) == 'trick' && player != target) return 'zeroplayertarget';
						},
            player: function (card, player, target, current) {
							if (get.type(card) == 'trick' && player != target) return 'zeroplayertarget';
						},
        },
    },
    group: "vl_crow_my_clean",
    subSkill: {
        clean: {
            trigger: {
                global: "roundStart",
            },
            popup: false,
            preHidden: true,
            charlotte: true,
            forced: true,
            content: function () {
							delete player.storage.vl_crow_my
						},
        },
    },
    t: {
        name: "藐意",
        info: "①你的回合外，当你成为锦囊牌目标时，你可以进行一次判定，若结果不为黑桃，你记录此牌并令其对你无效。②每轮游戏开始时，你清除「vl_crow_my」①的记录。",
    },
};
