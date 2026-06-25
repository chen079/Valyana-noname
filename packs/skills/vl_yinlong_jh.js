import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "discardAfter",
    },
    init: (player) => {
					if (!player.storage.vl_yinlong_jh) player.storage.vl_yinlong_jh = [2, 1]
				},
    filter(event, player) {
					return event.cards.some(i => get.suit(i) == 'club' && get.position(i) == 'd')
				},
    frequent: true,
    async content(event, trigger, player) {
					player.draw(player.storage.vl_yinlong_jh[0]);
					if (player.countCards('hs') > 0) player.chooseToUse()
					if (player.storage.vl_yinlong_jh[1] === 2) {
						if (player.countCards('hs') > 0) player.chooseToUse()
					}
				},
    _priority: 0,
    group: "vl_yinlong_jh_discard",
    subSkill: {
        discard: {
            trigger: {
                player: "phaseDiscardBefore",
            },
            init: (player) => {
							if (!player.storage.vl_yinlong_jh_discard) player.storage.vl_yinlong_jh_discard = 0
						},
            forced: true,
            async content(event, trigger, player) {
							if (!player.isMaxHandcard(true)) {
								player.storage.vl_yinlong_jh_discard += 2
								player.markSkill('vl_yinlong_jh_discard')
								player.when('phaseAfter').then(() => {
									player.storage.vl_yinlong_jh_discard = 0
									player.unmarkSkill('vl_yinlong_jh_discard')
								})
							} else {
								player.draw()
							}
						},
            mod: {
                maxHandcard(player, num) {
								return num + player.storage.vl_yinlong_jh_discard;
							},
            },
            _priority: 0,
        },
    },
    t: {
        name: "惊鸿",
        info: "锁定技，弃牌阶段开始时，若你不是全场手牌唯一最多的角色，本回合手牌上限+2，否则你摸一张牌。你的♣手牌因弃置进入弃牌堆时，你可以摸<span class=\"bluetext\">2</span>张牌并可以使用至多<span class=\"bluetext\">1</span>张牌。",
    },
};
