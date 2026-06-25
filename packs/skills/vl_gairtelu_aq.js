import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	zhuSkill: true,
	trigger: {
		player: "chooseCardBegin",
	},
	forced: true,
	filter(event, player) {
		return event.getParent(2).name === "chooseToDebate";
	},
	content: async function content(event, trigger, player) {
		const red = game.createCard("ying", "heart", 1);
		const black = game.createCard("ying", "spade", 1);
		const { links } = await player.chooseButton([trigger.prompt, [[red, black], 'card']], true).forResult();
		[red, black].forEach(i => {
			if (i !== links[0]) {
				i.fix();
				i.delete();
			}
		});
		trigger.directresult = links;
		const cardToDestroy = links[0];
		player.when({ global: "gainBegin" })
			.filter(event => event.cards.includes(cardToDestroy))
			.then(() => {
				trigger.cards.remove(cardToDestroy);
				game.cardsDiscard(cardToDestroy)
			})
			.vars({ cardToDestroy });
	},
	group: "vl_gairtelu_aq_change",
	subSkill: {
		change: {
			trigger: {
				global: "debateShowOpinion",
			},
			filter(event, player) {
				return event.targets.includes(player);
			},
			forced: true,
			direct: true,
			content: async function content(event, trigger, player) {
				const opinion = ["red", "black"].find(o => trigger[o].some(i => i[0] === player));
				if (!opinion) return;
				const differentOpinion = opinion === "red" ? "black" : "red";
				for (let i = 0; i < trigger[differentOpinion].length; i++) {
					const [target, card] = trigger[differentOpinion][i];
					if (target.group === "wei") {
						trigger[differentOpinion].splice(i--, 1);
						trigger[opinion].add([target, card]);
					}
				}
			},
		},
	},
	t: {
		name: "傲权",
		info: "主公技，锁定技，①你议事中不展示手牌，改为声明一种颜色，视为你的意见；②所有魏势力角色的意见视为和你相同。",
	},
};
