import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    position: "h",
    filterCard: true,
    check(card) {
					return 7 - get.value(card)
				},
    filterTarget: true,
    selectCard: 1,
    async content(event, trigger, player) {
					if (get.color(cards[0]) == 'red') {
						if (target.hasSkill('vl_lint_nd_lose')) {
							target.removeSkill('vl_lint_nd_lose')
						}
						target.addTempSkill("vl_lint_nd_gain", { player: "phaseEnd" })
					} else {
						if (target.hasSkill('vl_lint_nd_gain')) {
							target.removeSkill('vl_lint_nd_gain')
						}
						target.addTempSkill("vl_lint_nd_lose", { player: "phaseEnd" })
					}
				},
    ai: {
        order: 14,
        result: {
            target(player, target) {
							if (get.color(ui.selected.cards[0]) == 'black') return -2;
							if (get.color(ui.selected.cards[0]) == 'red') return 2;
						},
        },
    },
    subSkill: {
        gain: {
            trigger: {
                player: ["phaseUseBegin", "phaseUseEnd"],
            },
            direct: true,
            locked: true,
            init(player) {
							player.markSkill('vl_lint_nd_gain')
						},
            intro: {
                content: "你的出牌阶段开始和结束时，你将手牌数摸至五张。",
            },
            onremove(player) {
							player.unmarkSkill('vl_lint_nd_gain')
						},
            filter(event, player) {
							return player.countCards('h') < 5
						},
            async content(event, trigger, player) {
							player.draw(5 - player.countCards('h'));
						},
            sub: true,
        },
        lose: {
            trigger: {
                player: ["phaseUseBegin", "phaseUseEnd"],
            },
            init(player) {
							player.markSkill('vl_lint_nd_lose')
						},
            intro: {
                content: "你的出牌阶段开始和结束时，你将手牌数弃至一张。",
            },
            onremove(player) {
							player.unmarkSkill('vl_lint_nd_lose')
						},
            direct: true,
            filter(event, player) {
							return player.countCards('h') > 1
						},
            async content(event, trigger, player) {
							player.chooseToDiscard(player.countCards('h') - 1, 'h', true)
						},
            sub: true,
        },
    },
    t: {
        name: "掣肘",
        info: "出牌阶段限一次，你可以选择一名角色并弃置一张牌。若你弃置的牌为红色，该角色的下一个出牌阶段开始时与出牌阶段结束时，其将手牌摸至五张。若你弃置的牌为黑色，该角色的下一个出牌阶段开始时与出牌阶段结束时，其将手牌弃至一张。",
    },
};
