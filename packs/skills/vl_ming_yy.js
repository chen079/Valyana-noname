import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    mark: true,
    intro: {
        markcount: () => undefined,
        mark: function (dialog, storage, player) {
						dialog.addText('已经使用过的诗')
						dialog.addText(player.storage.vl_ming_yy[1].join('、'))
					},
    },
    usable: 2,
    direct: true,
    filter: function (event, player) {
					return event.card.name == 'sha';
				},
    init: function (player) {
					if (!player.storage.vl_ming_yy) {
						player.storage.vl_ming_yy = [{}, []]
					}
					game.loadJsonFromFile('extension/福瑞拓展/asset/json/poems.json', function (error, data) {
						if (error) {
							alert(error);
						} else {
							console.log(data);
						}
					}, player.storage.vl_ming_yy[0]);
				},
    content: function () {
					'step 0'
					player.chooseText().set('prompt', get.prompt2('vl_ming_yy')).set('ai', function () {
						var title = Object.keys(player.storage.vl_ming_yy[0])
						title = title.randomGet()
						return player.storage.vl_ming_yy[0][title]["poem"].randomGet()
					})
					'step 1'
					if (result.bool) {
						event.bool = false
						for (var i in player.storage.vl_ming_yy[0]) {
							if (!player.storage.vl_ming_yy[1].includes(i) && player.storage.vl_ming_yy[0][i]['poem'].includes(result.text)) {
								player.storage.vl_ming_yy[1].push(i)
								event.bool = true
								event.title = i
								event.author = player.storage.vl_ming_yy[0][i]['author']
								var str = i + '\n' + event.author
								player.say(str)
								break;
							}
						}
					} else {
						event.finish()
					}
					'step 2'
					if (event.bool) {
						game.log(player, '背诵了', '#g' + event.author, '写的', '#g《' + event.title + '》', '中的一句')
						var choices = ['你摸两张牌', '令此【杀】对' + get.translation(trigger.target) + '的伤害+1']
						var control = ['摸牌', '加伤']
						if (trigger.target.countCards('h') != 0) {
							choices.push('弃置' + get.translation(trigger.target) + '两张牌')
							control.push('弃牌')
						}
						if (trigger.target.countCards('hej') != 0) {
							choices.push('获得' + get.translation(trigger.target) + '区域内的一张牌')
							control.push('拿牌')
						}
						player.chooseControl(control, 'cancel2').set('choiceList', choices).set('ai', function () {
							var player = _status.event.player
							if (get.attitude(player, trigger.target) > 0) {
								return 'cancel2'
							} else {
								return control.randomGet()
							}
						})
					} else {
						game.log('你背诵的不是唐诗三百首中的诗或背诵错误！（记得检查标点符号是否打全）')
					}
					'step 3'
					if (result.control == '摸牌') {
						player.draw(2)
					} else if (result.control == '加伤') {
						var id = trigger.target.playerid;
						var map = trigger.getParent().customArgs;
						if (!map[id]) map[id] = {};
						if (typeof map[id].extraDamage != 'number') {
							map[id].extraDamage = 0;
						}
						map[id].extraDamage++;
					} else if (result.control == '弃牌') {
						player.discardPlayerCard(trigger.target, 'he', 2, true)
					} else if (result.control == '拿牌') {
						player.gainPlayerCard(trigger.target, 'hej', 1, true)
					}
				},
    t: {
        name: "吟咏",
        info: "每回合限两次，当你使用【杀】指定目标后，你可以背诵唐诗三百首中的任意一首诗的任意一句（诗名不可重复），如若此做，你可以选择一项：<li>1.摸两张牌，<li>2.弃置目标角色两张牌，<li>3.获得目标角色一张牌，<li>4.令此【杀】对目标角色的伤害+1。",
    },
};
