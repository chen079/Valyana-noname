import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 1,
	filter(event, player) {
		return player.storage.vl_dolina_sl[2].length
	},
	async content(event, trigger, player) {
		var choice = ['失去体力']
		if (player.countCards('h')) {
			choice.push('弃置手牌')
		}
		const choiceResult = await player.chooseControl(choice).set('ai', function () {
			if (choice.includes('弃置手牌')) {
				return '弃置手牌'
			} else {
				return '失去体力'
			}
		}).forResult();
		let num;
		if (choiceResult.control == '失去体力') {
			num = player.hp
		} else {
			num = player.countCards('h')
		}
		const name1 = choiceResult.control
		const numberResult = await player.chooseNumbers(get.prompt2('vl_dolina_fh'), [{ prompt: '请选择数量', min: 1, max: num }], true)
			.set("processAI", function () {
				const player = _status.event.player;
				return [Math.min(num, Math.floor(player.storage.vl_dolina_sl[2].length / 2))]
			}).forResult();
		num = numberResult.numbers[0]
		if (name1 == '失去体力') {
			await player.loseHp(num)
			await player.draw()
		} else {
			await player.chooseToDiscard(num, 'h', true)
			await player.recover()
		}
		const dialog = ui.create.dialog('分海', [player.storage.vl_dolina_sl[2], 'vcard'])
		const buttonResult = await player.chooseButton(2 * num).set('ai', function (button) {
			return Math.random();
		}).set('forced', true)
			.set('dialog', dialog)
			.set('prompt2', '恢复' + get.cnNumber(2 * num) + '个记录').forResult();
		dialog.close()
		for (var i of buttonResult.links) {
			let index = player.storage.vl_dolina_sl[2].findIndex(subArr => JSON.stringify(subArr) === JSON.stringify(i));
			if (index !== -1) {
				player.storage.vl_dolina_sl[2].splice(index, 1);
			}
			player.storage.vl_dolina_sl[1].push(i)
		}
	},
	ai: {
		result: {
			player: 2,
		},
		order: 4,
	},
	t: {
		name: "分海",
		info: `出牌阶段限一次，你可以失去体力/弃置手牌恢复两倍数量的${get.poptip("vl_dolina_sl")}的记录然后摸一张牌/回复1点体力。`,
	},
};
