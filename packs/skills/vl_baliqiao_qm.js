import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["loseAsyncAfter", "gainAfter"],
    },
    forced: true,
    filter(event, player, name, target) {
					const cardse = event.getl(player);
					// alert(cardse)
					const cards = cardse.cards2.addArray(cardse.js);
					// alert(cards.length)
					return cards.containsSome(...event.getg(target));
				},
    getIndex(event, player) {
					const cardse = event.getl(player);
					const cards = cardse.cards2.addArray(cardse.js);
					if (!event.getg || !event.getl || !cards.length) {
						return [];
					}
					return game
						.filterPlayer(current => {
							if (current == player) {
								return false;
							}
							return event.getg(current)?.length;
						})
						.sortBySeat();
				},
    logTarget: (event, player, name, target) => target,
    content: async function content(event, trigger, player) {
					await event.targets[0].draw();
				},
    group: "vl_baliqiao_qm_gain",
    subSkill: {
        gain: {
            trigger: {
                player: "gainAfter",
                global: "loseAsyncAfter",
            },
            forced: true,
            filter(event, player) {
							return game.hasPlayer(current => {
								if (current == player) return false;
								const cardse = event.getl(current);
								const cards = cardse.cards2.addArray(cardse.js);
								return cards.some(card => event.getg?.(player)?.includes(card));
							});
						},
            async content(event, trigger, player) {
							player.draw();
						},
        },
    },
    t: {
        name: "启明",
        info: "锁定技，你/其他角色获得其他角色/你区域内的牌后，摸一张牌。",
    },
};
