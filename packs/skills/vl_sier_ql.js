import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterCard(card, target) {
					return get.number(card) == 13
				},
    lose: false,
    discard: false,
    delay: false,
    position: "hes",
    filterTarget(card, player, target) {
					return target != player
				},
    filter(event, player) {
					return player.countCards('hes', function (card) {
						return get.number(card) == 13
					}) > 0
				},
    direct: true,
    content: async function content(event, trigger, player) {
					await player.give(event.cards, event.target);
					await event.target.draw();
				},
    group: "vl_sier_ql_recover",
    subSkill: {
        recover: {
            trigger: {
                target: ["taoBegin", "jiuBegin"],
            },
            zhuSkill: true,
            forced: true,
            filter(event, player) {
							if (event.player != player) return false;
							return player.isDying()
						},
            async content(event, trigger, player) {
							trigger.baseDamage++;
						},
        },
    },
    t: {
        name: "驱狼",
        info: "若你处于濒死状态，你的【桃】和【酒】对你自己生效时，数值+1。出牌阶段，你可以将一张点数为K的手牌交给另一名角色，其摸一张牌。",
    },
};
