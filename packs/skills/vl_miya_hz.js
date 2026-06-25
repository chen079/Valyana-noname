import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin",
    },
    filter(event, player) {
					return event.card && event.card.name == 'sha' && event.getParent().name == 'sha'
				},
    init(player) {
					if (!player.storage.vl_miya_hz) player.storage.vl_miya_hz = 0
				},
    intro: {
        content(storage, player, skill) { return '当前有' + storage + '个标记' },
    },
    mark: true,
    direct: true,
    async content(event, trigger, player) {
					trigger.num += player.storage.vl_miya_hz
					player.storage.vl_miya_hz += 1
					player.markSkill('vl_miya_hz')
				},
    group: "vl_miya_hz_one",
    subSkill: {
        one: {
            forced: true,
            popup: false,
            silent: true,
            trigger: {
                global: "phaseEnd",
            },
            async content(event, trigger, player) {
							player.storage.vl_miya_hz = 0
							player.updateMark('vl_miya_hz')
						},
            sub: true,
        },
    },
    t: {
        name: "挥斩",
        info: "当你的【杀】造成伤害后，你获得1个“挥斩”标记，然后本回合内下一次因执行【杀】的效果造成的伤害+X（X为“挥斩”标记数量）。",
    },
};
