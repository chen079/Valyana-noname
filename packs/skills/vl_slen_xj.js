import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterTarget(card, player, target) {
					return player != target && target.countCards('h') > 0
				},
    position: "h",
    usable: 1,
    discard: false,
    lose: false,
    delay: false,
    selectCard: [1, 2],
    filterCard(card) {
					if (ui.selected.cards.length) {
						return get.number(card) != get.number(ui.selected.cards[0]);
					}
					return true;
				},
    check(card) {
					return 5 - get.value(card)
				},
    filter(event, player) {
					return player.countCards('h') > 0
				},
    async content(event, trigger, player) {
        const target = event.target;
        const cards = event.cards;
        target.gain(cards, player, 'giveAuto').gaintag.add('vl_slen_xj')
        var cardx = target.getCards('h')
        var listbig = []
        var listsmall = []
        var listmiddle = []
        for (var i = 0; i < cardx.length; i++) {
            if (cards.length == 1) {
                if (get.number(cardx[i]) >= get.number(cards[0])) listbig.push(cardx[i])
                if (get.number(cardx[i]) <= get.number(cards[0])) listsmall.push(cardx[i])
            } else {
                if (get.number(cards[0]) > get.number(cards[1])) {
                    if ((get.number(cardx[i]) <= get.number(cards[0])) && (get.number(cardx[i]) >= get.number(cards[1]))) listmiddle.push(cardx[i])
                    event.small = get.number(cards[1])
                    event.big = get.number(cards[0])
                } else {
                    if ((get.number(cardx[i]) <= get.number(cards[1])) && (get.number(cardx[i]) >= get.number(cards[0]))) listmiddle.push(cardx[i])
                    event.small = get.number(cards[0])
                    event.big = get.number(cards[1])
                }
            }
        }
        event.listbig = listbig
        event.listsmall = listsmall
        event.listmiddle = listmiddle
        if (cards.length == 1) {
            var value1 = 0
            var value2 = 0
            for (var i = 0; i < event.listsmall.length; i++) {
                value1 += get.value(event.listsmall[i])
            }
            for (var j = 0; j < event.listbig.length; j++) {
                value2 += get.value(event.listbig[j])
            }
            const controlResult = await target.chooseControl('选项一', '选项二').set('choiceList', ['交给' + get.translation(player) + '点数不大于' + get.number(cards[0]) + '的所有牌', '交给' + get.translation(player) + '点数不小于' + get.number(cards[0]) + '的所有牌']).set('ai', function () {
                if (value1 > value2) {
                    return '选项二'
                } else {
                    return '选项一'
                }
            }).forResult();
            if (controlResult.control == '选项一') {
                player.gain(event.listsmall, target, 'giveAuto')
            } else if (controlResult.control == '选项二') {
                player.gain(event.listbig, target, 'giveAuto')
            }
            return;
        }
        const cardResult = await target.chooseCard('h', [1, event.listmiddle.length], '交给' + get.translation(player) + '任意张点数∈[' + event.small + ',' + event.big + ']之间的手牌并摸等量的牌', function (card) {
            return event.listmiddle.includes(card)
        }).set('ai', function (card) {
            var player = _status.event.player;
            if (get.position(card) == 'h' && !player.countCards('h', 'du') && (player.hp > 2 || !player.countCards('h', function (card) {
                return get.value(card) >= 8;
            }))) {
                return 1;
            }
            return 6 - get.value(card)
        }).set('complexCard', true).forResult();
        if (cardResult.bool) {
            var num = 0
            if (cardResult.cards.length == event.listmiddle.length) num += 1
            player.gain(cardResult.cards, target, 'giveAuto')
            target.draw(cardResult.cards.length + num)
            target.removeGaintag('vl_slen_xj');
        }
    },
    ai: {
        result: {
            player(player) {
							if (ui.selected.cards.length == 2) {
								return -0.5;
							}
							return 1;
						},
            target(player, target) {
							if (ui.selected.cards.length == 2) {
								return 1;
							}
							return 1 / target.countCards('h') - 2;
						},
        },
        order: 5,
    },
    t: {
        name: "心计",
        info: "出牌阶段限一次，你可以交给一名有手牌的其他角色至多两张手牌：<br>若你交给其一张手牌，其选择一项：</br><li>①交给你点数不大于此牌的所有牌；<li>②交给你点数不小于此牌的所有牌。</li>若你交给其两张手牌，其可以交给你任意张点数介于二者之间（含二者）的手牌并摸等量的牌，若其交给你点数属于该区间内的所有手牌，其额外摸一张牌。",
    },
};
