import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    frequent: true,
    content: function () {
					'step 0'
					event.cards = [];
					event.suits = [];
					'step 1'
					player.judge(function (result) {
						var evt = _status.event.getParent('vl_kulun_dirt_zw');
						if (evt && evt.suits && evt.suits.includes(get.suit(result))) return 0;
						return 1;
					}).set('callback', lib.skill.vl_kulun_dirt_zw.callback).judge2 = function (result) {
						return result.bool ? true : false;
					};
					'step 2'
					var cards = cards.filterInD();
					if (cards.length) player.chooseTarget('将' + get.translation(cards) + '交给一名角色', true).set('ai', function (target) {
						var player = _status.event.player;
						var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
						if (target.hasSkillTag('nogain')) att /= 10;
						return att;
					});
					else event.finish();
					'step 3'
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.line(target, 'green');
						target.gain(cards, 'gain2').giver = player;
					}
					else event.finish();
				},
    callback: function () {
					'step 0'
					var evt = event.getParent(2);
					event.getParent().orderingCards.remove(event.judgeResult.card);
					evt.cards.push(event.judgeResult.card);
					if (event.getParent().result.bool) {
						evt.suits.push(event.getParent().result.suit);
						player.chooseBool('是否继续发动【载物】？').set('frequentSkill', 'vl_kulun_dirt_zw');
					}
					else event._result = { bool: false };
					'step 1'
					if (result.bool) event.getParent(2).redo();
				},
    ai: {
        order: 9,
        result: {
            player: 1,
        },
    },
    _priority: 0,
    t: {
        name: "载物",
        info: "出牌阶段限一次。你可进行判定。若判定结果与本次发动技能时的其他判定结果的花色均不相同，则你可以重复此流程。然后你将这些判定牌交给一名角色。",
    },
};
