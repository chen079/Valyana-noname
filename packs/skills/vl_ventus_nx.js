import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    mod: {
        cardEnabled(card, player) {
						if (player.countMark('vl_ventus_nx') >= player.hp) return false;
					},
        cardUsable(card, player) {
						if (player.countMark('vl_ventus_nx') >= player.hp) return false;
					},
        cardRespondable(card, player) {
						if (player.countMark('vl_ventus_nx') >= player.hp) return false;
					},
    },
    init(player, storage) {
					if (!player.storage.vl_ventus_nx) player.storage.vl_ventus_nx = 0
				},
    trigger: {
        player: "useCard1",
    },
    filter(event, player) {
					return _status.currentPhase == player
				},
    mark: true,
    intro: {
        content: "你已使用$张牌",
    },
    forced: true,
    popup: false,
    firstDo: true,
    async content(event, trigger, player) {
					player.addMark('vl_ventus_nx', 1, false);
				},
    ai: {
        presha: true,
        pretao: true,
        nokeep: true,
    },
    group: ["vl_ventus_nx_clean", "vl_ventus_nx_damage"],
    subSkill: {
        damage: {
            trigger: {
                player: "damageBegin4",
            },
            filter(event, player) {
							if (player == _status.currentPhase) return false;
							if (event.getParent().name == 'sha' || event.getParent().name == 'juedou') return false;
							return true
						},
            forced: true,
            async content(event, trigger, player) {
							trigger.untrigger();
							trigger.finish();
						},
            sub: true,
        },
        clean: {
            trigger: {
                player: "phaseAfter",
            },
            forced: true,
            async content(event, trigger, player) {
							var num = player.countMark('vl_ventus_nx')
							player.removeMark('vl_ventus_nx', num)
							player.updateMark('vl_ventus_nx')
						},
            sub: true,
        },
    },
    t: {
        name: "匿形",
        info: "锁定技，当你于回合外受到伤害时，若此伤害不是由【杀】或【决斗】造成的，你防止之；出牌阶段，你最多使用X张牌（X为你的体力值）。",
    },
};
