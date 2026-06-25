import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    content: function () {
					"step 0"
					var list = ['免疫']
					var choiceList = ['下一名角色的回合内，你不能成为手牌数大于你的角色的目标。']
					if (trigger.player != player && player.countCards('h') > 0 && trigger.player.isAlive()) {
						list.push('出杀')
						choiceList.push('将一张牌当【杀】对' + get.translation(trigger.player) + '使用')
					}
					player.chooseControl(list, 'cancel2').set('choiceList', choiceList).set('ai', function () {
						var att = get.attitude(player, target)
						if (player.countCards('h') > 2 && att < 0 && list.includes('出杀')) {
							return '出杀'
						} else {
							return '免疫'
						}
					}).set('target', trigger.player)
					'step 1'
					if (result.control == 'cancel2') {
						event.finish()
					} else if (result.control == '出杀') {
						player.logSkill("vl_blackwolf_nb");
						player.chooseCard(1, 'h', true,card=>{
							return player.canUse(card,trigger.player)
						}).set('ai', function (card) {
							return 100 - get.value(card)
						})
					} else if (result.control == '免疫') {
						player.logSkill("vl_blackwolf_nb");
						player.addTempSkill('vl_blackwolf_nb_1', 'phaseEnd')
						event.finish()
					}
					'step 2'
					player.useCard(result.cards, { name: 'sha' }, trigger.player, false).viewAs = true;
				},
    mark: true,
    intro: {
        content: "可以发动〖匿波〗",
    },
    group: "vl_blackwolf_nb_clean",
    subSkill: {
        "1": {
            mark: true,
            intro: {
                content: "你本回合不能成为手牌数大于你的角色使用牌的目标。",
            },
            forced: true,
            charlotte: true,
            mod: {
                targetEnabled: function (card, player, target) {
								if (player.countCards('h') > target.countCards('h')) return false
							},
            },
        },
        clean: {
            trigger: {
                player: "damageEnd",
            },
            forced: true,
            content: function () {
							player.tempBanSkill('vl_blackwolf_nb', { player: "phaseJieshuBegin" })
						},
        },
    },
    t: {
        name: "匿波",
        info: "每名角色的回合结束时，你可以选择一项：<li>1.将一张手牌当作【杀】对该角色使用。<li>2.下一名角色的回合内，你不能成为手牌数大于你的角色使用牌的目标。</li>当你受到伤害后，此技能失效直到你的结束阶段。</li>",
    },
};
