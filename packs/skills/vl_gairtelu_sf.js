import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardAfter",
    },
    filter(event, player) {
					const suit = get.suit(event.card);
					return !player.hasHistory("useCard", evt => evt !== event && get.suit(evt.card) === suit, event);
				},
    forced: true,
    direct: true,
    content: async function content(event, trigger, player) {
					if (!player.storage.vl_gairtelu_sf) {
						player.when({ global: "phaseUseAfter" }).then(() => {
							player.unmarkSkill("vl_gairtelu_sf");
						});
					}
					player.markAuto("vl_gairtelu_sf", get.suit(trigger.card));

					const targets = [];
					game.getGlobalHistory("useCard", evt => {
						if (evt.player !== player) return;
						if (!evt.targets || !evt.targets.length) return;
						targets.addArray(evt.targets);
					});
					targets.add(player);

					player.logSkill(event.name, targets);
					const result = await player.chooseToDebate(targets).forResult();
					const map = {
						gain: [],
						use: [],
					};
					["red", "black"].forEach(opinion => {
						if (opinion === result.opinion) map.gain.addArray(result[opinion].map(i => i[1]));
						else map.use.addArray(result[opinion]);
					});
					map.use.sort((a, b) => lib.sort.seat(a[0], b[0]));
					if (map.gain.length) await player.gain(map.gain);
					for (const [target, card] of map.use) {
						if (lib.filter.targetEnabled2(card, target, player)) await target.useCard(card, player);
						else await target.discard(card);
					}
				},
    intro: {
        content: "本阶段已使用过$",
        onunmark: true,
    },
    t: {
        name: "奢繁",
        info: "锁定技，出牌阶段，你首次使用一种花色的牌后，你与本回合成为过你牌目标的角色议事，意见与结果不同/相同的其他角色将展示牌对你使用/交给你（若不能使用则弃置）。",
    },
};
