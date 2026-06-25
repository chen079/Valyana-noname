import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBegin",
    },
    filter: function (event, player) {
					return event.player == player || player.inRange(event.player)
				},
    direct: true,
    content: function () {
					'step 0'
					event.allphase = []
					event.standard = []
					for (var i of lib.phaseName) {
						event.standard.push(game.createCard('fr_' + i, '', ''))
					}
					for (var i of trigger.phaseList) {
						event.allphase.push(game.createCard('fr_' + i, '', ''))
					}
					player.chooseCardButton('【时移】：选择令' + get.translation(trigger.player) + '获得的主要阶段', event.standard.slice(1, event.standard.length - 1))
						.set('ai', function (button) {
							var att = get.attitude(_status.event.player, trigger.player)
							if (att > 0) {
								switch (button.link.name) {
									case 'fr_phaseUse': return 1;
									case 'fr_phaseDraw': return 2;
									case 'fr_phaseJudge': return -1
									case 'fr_phaseDiscard': return -2
								}
							} else {
								switch (button.link.name) {
									case 'fr_phaseUse': return -1;
									case 'fr_phaseDraw': return -2;
									case 'fr_phaseJudge': return 1
									case 'fr_phaseDiscard': return 2
								}
							}
						})
					'step 1'
					if (result.links) {
						event.allphase.push(result.links[0])
					}
					'step 2'
					var next = player.chooseToMove('【时移】：交换' + get.translation(trigger.player) + '的回合阶段顺序。')
					next.set('processAI', function (list) {
						var cards = list[0][1], player = _status.event.player;
						var target = trigger.player;
						var att = get.attitude(player, target);
						if (att < 0) {
							cards.swapElements(3, 4)
						} else {
							if (target.countCards('h') < target.hp) {
								cards.swapElements(1, 4)
							}
						}
						return [cards]
					})
					next.set('list', [
						['回合顺序', event.allphase],
					])
					'step 3'
					if (result.bool && result.moved && result.moved[0].length) {
						event.cards = result.moved[0];
					} else {
						event.finish()
					}
					'step 4'
					trigger.phaseList = event.cards.map(i => i.name.replace('fr_', ''))
				},
    t: {
        name: "时移",
        info: "你或在你攻击范围内的角色回合开始时，你可以令其于结束阶段后获得一个「zhuyaojieduan」，且你可以调换其本回合的「jieduan」顺序。",
    },
};
