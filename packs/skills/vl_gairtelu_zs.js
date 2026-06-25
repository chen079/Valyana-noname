import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardBegin",
    },
    filter: function filter(event, player) {
					if (!event.targets) return false;
					if (!["basic", "trick"].includes(get.type(event.card))) return false;
					const info = get.info(event.card);
					if (info.multitarget) return false;
					return game.hasPlayer(current => lib.filter.targetEnabled2(event.card, event.player, current));
				},
    forced: true,
    direct: true,
    content: async function content(event, trigger, player) {
					const card = trigger.card;
					const { targets } = await player.chooseTarget([1, Infinity], true, (_, player, target) => lib.filter.targetEnabled2(card, player, target))
						.set("prompt", get.translation("vl_gairtelu_zs") + "：为" + get.translation(trigger.card) + "重新分配目标")
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						}).forResult();
					trigger.targets = targets;
					targets.forEach(i => i.addTempSkill("vl_gairtelu_zs_banned", { global: "phaseUseEnd" }));
				},
    mod: {
        targetInRange: function (card, player, target, now) {
						return true;
					},
    },
    subSkill: {
        banned: {
            mark: true,
            intro: {
                content: "本阶段不能成为盖尔德鲁使用牌的目标",
            },
            mod: {
                targetEnabled: function (card, player, target, now) {
								if (player.hasSkill("vl_gairtelu_zs")) return false;
							},
            },
        },
    },
    t: {
        name: "恣睢",
        info: "锁定技，当你于出牌阶段内使用基本牌或普通锦囊牌时，你重新指定任意名合法角色为目标，然后这些角色本阶段不能再成为你使用牌的目标。",
    },
};
