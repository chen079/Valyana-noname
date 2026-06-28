import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	filter(event, player) {
		return event.card && event.card.name == 'sha' && player.hujia > 0
	},
	trigger: {
		player: "useCardToPlayered",
	},
	shaRelated: true,
	cost: async function cost(event, trigger, player) {
		let list = []
		for (let i = 0; i < player.hujia; i++) {
			list.push(i + 1)
		}
		const result = await player.chooseControl(list, 'cancel2')
			.set('prompt', '请选择要失去的护甲值并令此【杀】伤害+X')
			.set('ai', function () {
				let player = _status.event.player
				let target = _status.event.target
				let att = get.attitude(player, target)
				if (att > 0) {
					return 'cancel2'
				} else {
					return (Math.max(list) - 1)
				}
			}).set('target', trigger.target)
			.forResult();
		event.result = { bool: result.control != "cancel2", cost_data: result }
	},
	content: async function content(event, trigger, player) {
		const num = event.cost_data.index + 1
		await player.changeHujia(-num)
		if (trigger.target.hujia > 0) {
			if (num > trigger.target.hujia) {
				await trigger.target.changeHujia(-trigger.target.hujia)
			} else if (num < trigger.target.hujia) {
				await trigger.target.changeHujia(-num)
			}
		}
		const id = trigger.target.playerid;
		const map = trigger.getParent().customArgs;
		if (!map[id]) map[id] = {};
		if (typeof map[id].extraDamage != 'number') {
			map[id].extraDamage = 0;
		}
		map[id].extraDamage += num;
	},
	group: "vl_xiaomo_sj_draw",
	subSkill: {
		draw: {
			trigger: {
				player: "phaseDrawBegin2",
			},
			direct: true,
			filter(event, player) {
				return !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num += player.hujia;
			},
			ai: {
				threaten: 1.3,
			},
		},
	},
	t: {
		name: "闪击",
		info: "摸牌阶段，你多摸等同于你护甲值的牌；当你使用【杀】指定目标后，你可以失去任意数量的护甲，令此【杀】的目标失去等量护甲，且此【杀】对其的伤害增加等量。",
        taici: ['闪击成势，护甲化锋。', '别挡路，我只停一瞬。'],
    },
};
