import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter: function (event, player) {
					return player.storage.vl_dolina_sl[2].length
				},
    content: function () {
					'step 0'
					var choice = ['失去体力']
					if (player.countCards('h')) {
						choice.push('弃置手牌')
					}
					player.chooseControl(choice).set('ai', function () {
						if (choice.includes('弃置手牌')) {
							return '弃置手牌'
						} else {
							return '失去体力'
						}
					})
					'step 1'
					if (result.control == '失去体力') {
						event.num = player.hp
					} else {
						event.num = player.countCards('h')
					}
					event.name1 = result.control
					'step 2'
					player.chooseNumbers(get.prompt2('vl_dolina_fh'), [{ prompt: '请选择数量', min: 1, max: event.num }], true)
						.set("processAI", function () {
							const player = _status.event.player;
							return [Math.min(event.num, Math.floor(player.storage.vl_dolina_sl[2].length / 2))]
						})
					'step 3'
					event.num = result.numbers[0]
					if (event.name1 == '失去体力') {
						player.loseHp(event.num)
						player.draw()
					} else {
						player.chooseToDiscard(event.num, 'h', true)
						player.recover()
					}
					'step 4'
					event.dialog = ui.create.dialog('分海', [player.storage.vl_dolina_sl[2], 'vcard'])
					player.chooseButton(2 * event.num).set('ai', function (button) {
						return Math.random();
					}).set('forced', true)
						.set('dialog', event.dialog)
						.set('prompt2', '恢复' + get.cnNumber(2 * event.num) + '个记录')
					'step 5'
					event.dialog.close()
					for (var i of result.links) {
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
        info: "出牌阶段限一次，你可以失去体力/弃置手牌恢复两倍数量的「vl_dolina_sl」的记录然后摸一张牌/回复1点体力。",
    },
};
