import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import idiom from '../jsons/idiom.json'

export default {
	enable: "phaseUse",
	direct: true,
	usable: 1,
	init(player) {
		if (!player.getStorage('vl_ming_yc', null)) {
			player.setStorage('vl_ming_yc', {
				'lib': [],
				'used': [],
				'last': ''
			});
		}
		player.getStorage('vl_ming_yc', {}).lib = idiom
	},
	mark: true,
	intro: {
		markcount(storage, player) {
			return player.getStorage('vl_ming_yc', { used: [] }).used.length
		},
		mark(dialog, storage, player) {
			dialog.addText('已经使用过的成语')
			dialog.addText(player.getStorage('vl_ming_yc', { used: [] }).used.join('、'))
		},
	},
	async content(event, trigger, player) {
		let ainum = 0
		let draw = 0
		for (let i of game.players) {
			if (get.attitude(player, i) < 0) {
				draw += 2
			} else {
				draw += 1
			}
		}
		while (true) {
			const storage = player.getStorage('vl_ming_yc', { lib: [], used: [], last: '' });
			const result = await player.chooseText().set('prompt', '是否发动【语出】').set('prompt2', storage.last == '' ? get.translation('vl_ming_yc_info') : '你的上一个成语为：' + storage.last + '，请输入一个以“' + storage.last.charAt(storage.last.length - 1) + '”开头的成语。').set('ai', function () {
				const storage = player.getStorage('vl_ming_yc', { lib: [], used: [], last: '' });
				if (ainum == 0) {
					return storage.lib.randomGet()
				} else if (ainum < Math.min(Math.max(draw, 5), 9)) {
					let word = storage.lib.find(function (item) {
						return item.charAt(0) == storage.last.charAt(storage.last.length - 1) && !storage.used.includes(item)
					})
					if (word) {
						return word
					} else {
						return storage.lib.randomGet()
					}
				} else {
					return storage.lib.randomGet()
				}
			}).forResult();
			if (result.bool) {
				ainum++
				if (storage.lib.includes(result.text) && !storage.used.includes(result.text)) {
					if (!storage.last || storage.last.charAt(storage.last.length - 1) == result.text.charAt(0)) {
						await player.draw()
						storage.last = result.text
						storage.used.push(result.text)
						game.log(player, '接龙的成语为：' + storage.last)
						player.say(result.text)
						await game.delay()
						continue;
					} else {
						game.log(player, '输入错误')
						storage.last = ''
					}
				} else if (storage.used.includes(result.text)) {
					game.log(player, '输入的内容已经使用过。')
					storage.last = ''
				} else {
					game.log(player, '输入错误')
					storage.last = ''
				}
			}
			return;
		}
	},
	ai: {
		order: 12,
		result: {
			player: 1,
		},
	},
	t: {
		name: "语出",
		info: "出牌阶段限一次，你可以进行一次“成语接龙”（不可使用你输入过的成语），然后每当你成功接龙一次，你摸一张牌并重复此流程。",
	},
};
