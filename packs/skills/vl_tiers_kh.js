import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "loseHpEnd",
    },
    filter: function (event, player) {
					if (player != _status.currentPhase) return false
					return event.num >= 2
				},
    forced: true,
    content: function () {
					player.addTempSkill('vl_tiers_kh_1', { player: "phaseBegin" })
					player.addTempSkill('vl_tiers_kh_hh', { player: "phaseUseBegin" })
				},
    subSkill: {
        "1": {
            trigger: {
                source: "damageSource",
            },
            direct: true,
            filter: function (event, player) {
							return event.num > 0 && event.player != event.target
						},
            content: function () {
							player.recover()
						},
        },
        hh: {
            trigger: {
                player: "phaseUseAfter",
            },
            direct: true,
            content: function () {
							player.draw(2)
							var next = player.phaseUse();
							event.next.remove(next);
							trigger.next.push(next);
						},
        },
    },
    t: {
        name: "狂花",
        info: "当于你的回合内失去体力后，若此次失去体力的值不小于2点，你于出牌阶段结束后摸两张牌并执行一个额外的出牌阶段，且你获得以下效果直到你的下个回合开始：<li>当你造成伤害后，你回复1点体力。</li>",
    },
};
