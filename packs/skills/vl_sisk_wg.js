import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    init: function (player) {
					if (!player.vl_sisk_wg) player.vl_sisk_wg = '平';
				},
    usable: 1,
    mark: true,
    marktext: "🎶",
    intro: {
        content: function (storage, player) {
						var str;
						switch (player.vl_sisk_wg) {
							case '平': str = '出牌阶段限一次，你可以消耗1点魔力或失去1点体力，然后摸1张牌并获得2层' + get.dialogIntro('shixue') + ''; break;
							case '仄': str = '出牌阶段限一次，你可以消耗1点魔力或失去1点体力，重铸所有手牌，获得1层' + get.dialogIntro('kangfen'); break;
						}
						return '<li>当前韵律：' + (player.vl_sisk_wg || '平') + '<br><li>' + str;
					},
    },
    direct: true,
    group: ["vl_sisk_wg_zhuanyun"],
    yunlvSkill: true,
    content: function () {
					'step 0'
					var list = ['失去体力']
					if (player.Vp > 0) list.push('消耗魔力')
					player.chooseControl(list, 'cancel2').set('prompt', get.prompt2('vl_sisk_wg'))
						.set('ai', () => {
							if (list.includes('消耗魔力')) return '消耗魔力'
							else if (player.hp > game.players.length) return '失去体力'
							else return 'cancel2'
						})
					'step 1'
					if (result.control == '失去体力') {
						player.loseHp()
					} else if (result.control == '消耗魔力') {
						player.consumeVp()
					} else {
						if (player.getStat('skill')['vl_sisk_wg']) player.getStat('skill')['vl_sisk_wg']--
						event.finish()
					}
					'step 2'
					switch (player.vl_sisk_wg || '平') {
						case '平':
							player.draw()
							player.addVuff('shixue')
							break;
						case '仄':
							player.addVuff('kangfen', 2)
							var cards = player.getCards('h')
							player.recast(cards)
							break;
					}
				},
    ai: {
        order: 7,
        result: {
            player: function (player, target) {
							if (!(player.Vp > 0 || player.hp > game.players.length)) return -2
							switch (player.vl_sisk_wg || '平') {
								case '平': return 4
								case '仄': return 3
							}
						},
        },
    },
    subSkill: {
        zhuanyun: {
            trigger: {
                player: "gainVpAfter",
            },
            forced: true,
            locked: false,
            content: function () {
							player.changeYun('vl_sisk_wg');
						},
            sub: true,
        },
    },
    t: {
        name: "挽歌",
        info: "韵律技，出牌阶段限一次，你可以消耗1点魔力或失去1点体力，然后：<li>平：摸一张牌，获得1层「嗜血」；<li>仄：重铸所有手牌，获得2层「亢奋」；<li>转韵：你获得魔力后。",
    },
};
