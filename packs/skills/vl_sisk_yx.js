import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "recoverBegin",
    },
    vpSkill: true,
    forced: true,
    filter: (event, player) => {
					var evtx = event.getParent('phaseUse');
					if (!evtx || evtx.player != player) return false;
					return event.num > 0 && !player.isDying()
				},
    async content(event, trigger, player) {
					trigger.cancel()
					player.gainVp(trigger.num)
				},
    group: "vl_sisk_yx_recover",
    subSkill: {
        recover: {
            trigger: {
                player: "phaseAfter",
            },
            direct: true,
            locked: true,
            lastDo: true,
            filter(event, player) {
							return player.hp < player.maxHp - 1
						},
            async content(event, trigger, player) {
							var num = player.maxHp - 1 - player.hp
							player.recover(num)
							player.consumeVp(num)
						},
        },
    },
    t: {
        name: "饮血",
        info: "锁定技，你于出牌阶段回复体力时，改为增加等量魔力。回合结束时，将体力回复至你的体力上限-1（至多回复X点，X为你的魔力值），并消耗等量魔力。",
    },
};
