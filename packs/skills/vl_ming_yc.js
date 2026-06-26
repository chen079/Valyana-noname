import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	direct: true,
	usable: 1,
	init(player) {
		if (!player.storage.vl_ming_yc) {
			player.storage.vl_ming_yc = {
				'lib': [],
				'used': [],
				'last': ''
			};
		}
		game.loadJsonFromFile('extension/福瑞拓展/asset/json/idiom.json', function (error, data) {
			if (error) {
				alert(error);
			} else {
				console.log(data);
			}
		}, player.storage.vl_ming_yc.lib);
	},
	mark: true,
	intro: {
		markcount(storage, player) {
			return player.storage.vl_ming_yc.used.length
		},
		mark(dialog, storage, player) {
			dialog.addText('已经使用过的成语')
			dialog.addText(player.storage.vl_ming_yc.used.join('、'))
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
			const result = await player.chooseText().set('prompt', '是否发动【语出】').set('prompt2', player.storage.vl_ming_yc.last == '' ? get.translation('vl_ming_yc_info') : '你的上一个成语为：' + player.storage.vl_ming_yc.last + '，请输入一个以“' + player.storage.vl_ming_yc.last.charAt(player.storage.vl_ming_yc.last.length - 1) + '”开头的成语。').set('ai', function () {
				if (ainum == 0) {
					return player.storage.vl_ming_yc.lib.randomGet()
				} else if (ainum < Math.min(Math.max(draw, 5), 9)) {
					let word = player.storage.vl_ming_yc.lib.find(function (item) {
						return item.charAt(0) == player.storage.vl_ming_yc.last.charAt(player.storage.vl_ming_yc.last.length - 1) && !player.storage.vl_ming_yc.used.includes(item)
					})
					if (word) {
						return word
					} else {
						return player.storage.vl_ming_yc.lib.randomGet()
					}
				} else {
					return player.storage.vl_ming_yc.lib.randomGet()
				}
			}).forResult();
			if (result.bool) {
				ainum++
				if (player.storage.vl_ming_yc.lib.includes(result.text) && !player.storage.vl_ming_yc.used.includes(result.text)) {
					if (!player.storage.vl_ming_yc.last || player.storage.vl_ming_yc.last.charAt(player.storage.vl_ming_yc.last.length - 1) == result.text.charAt(0)) {
						await player.draw()
						player.storage.vl_ming_yc.last = result.text
						player.storage.vl_ming_yc.used.push(result.text)
						game.log(player, '接龙的成语为：' + player.storage.vl_ming_yc.last)
						player.say(result.text)
						await game.delay()
						continue;
					} else {
						game.log(player, '输入错误')
						player.storage.vl_ming_yc.last = ''
					}
				} else if (player.storage.vl_ming_yc.used.includes(result.text)) {
					game.log(player, '输入的内容已经使用过。')
					player.storage.vl_ming_yc.last = ''
				} else {
					game.log(player, '输入错误')
					player.storage.vl_ming_yc.last = ''
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
