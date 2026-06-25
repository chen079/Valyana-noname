import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filter: function (event, player) {
					return player.countCards('he', { color: "black" }) > 0 || player.hasCard('du')
				},
    position: "he",
    filterCard: function (card) {
					return get.color(card) == 'black' || get.name(card) == 'du'
				},
    check: function (card) {
					if (card.name == 'du') {
						return 10
					} else return 6 - get.value(card)
				},
    filterTarget: true,
    content: function () {
					'step 0'
					var choice = ['选项一'], choiceList = ['令' + get.translation(target) + '获得' + (get.name(cards[0]) == 'du' ? 2 : 1) + '层「中毒」']
					if (target.countVuffNum('zhongdu') > 0) {
						choice.push('选项二')
						choiceList.push('衰减' + get.translation(target) + '所有【中毒】层数')
					}
					if (choice.length == 1) {
						event._result = {
							control: '选项一'
						}
					} else {
						player.chooseControl(choice).set('choiceList', choiceList).set('ai', function () {
							if (target.countVuffNum('zhongdu') > 1) {
								return '选项二'
							} else {
								return '选项一'
							}
						})
					}
					'step 1'
					if (result.control == '选项一') {
						target.addVuff('zhongdu', get.name(cards[0]) == 'du' ? 2 : 1)
						event.finish()
					}
					'step 2'
					target.reduceVuff('zhongdu', 'naturalLose')
					if (target.countVuffNum('zhongdu') > 0) {
						event.redo()
					}
				},
    ai: {
        order: 7,
        result: {
            target: -3,
        },
    },
    t: {
        name: "蛊蛇",
        info: "出牌阶段，你可以弃置一张黑色牌或一张【毒】，然后令一名角色执行一项：<li>1.「中毒」层数+1（若弃置【毒】则改为+2）；<li>2.「shuaijian」所有「中毒」层数。",
    },
};
