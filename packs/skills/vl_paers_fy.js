import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    forced: true,
    marktext: "☯",
    zhuanhuanji: "number",
    zhuanhuanLimit: 3,
    trigger: {
        player: "loseAfter",
        global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"],
    },
    mark: true,
    intro: {
        markcount: (storage) => ['①', '②', '③'][(storage || 0) % 3],
        content: function (storage, player, skill) {
                        return '当你不因使用或此技能而失去手牌后，若你有手牌，你'+["将一张牌置于牌堆顶","从牌堆底摸一张牌","获得一名其他角色的一张牌，然后你可以视为使用无距离限制的【杀】并失去1点体力"][(storage || 0) % 3] + '。';
					},
    },
    filter: function (event, player) {
					if (event.getParent().name == "useCard") return false;
					if (event.getParent().name == 'vl_paers_fy') return false;
					if (!player.countCards("h")) return;
					return event.getl(player)?.hs.length;
				},
    content: function () {
					"step 0"
					player.changeZhuanhuanji("vl_paers_fy");
					if (player.countMark("vl_paers_fy")%3 == 1) {
						player.chooseCard('he', '将一张牌置于牌堆顶', true).set('ai', function (card) {
							return get.value(card)
						})
					} else if (player.countMark("vl_paers_fy")%3 == 2) {
						player.draw('bottom')
						event.finish()
					} else if (player.countMark("vl_paers_fy")%3 == 0 && game.hasPlayer(function (current) { return current != player && current.countCards('he') > 0 })) {
						event.goto(2)
					}else{
						event.goto(4)
					}
					"step 1"
					player.lose(result.cards, ui.cardPile, 'visible', 'insert');
					player.$throw(result.cards[0], 1000);
					game.log(player, '将', result.cards, '置于牌堆顶');
					game.updateRoundNumber();
					event.finish();
					"step 2"
					player.chooseTarget('获得一名其他角色的一张牌', true, function (card, player, target) {
						return player != target && target.countCards('he') > 0
					}).set('ai', function (target) {
						var player = _status.event.player
						return -get.attitude(player, target)
					})
					"step 3"
					player.gainPlayerCard(1, 'he', result.targets[0], true)
					'step 4'
					player.chooseUseTarget('###是否发动【愤延】？###视为使用一张没有距离限制的【杀】，然后失去1点体力。', { name: 'sha' }, false, 'nodistance').set('ai', function (player) {
						var player = _status.event.player
						return player.hp > 1
					})
					"step 5"
					if (result.bool) {
						player.loseHp();
					}
				},
    t: {
        name: "愤延",
        info: "锁定技，转换技，当你不因使用或此技能而失去手牌后，若你有手牌，你①将一张牌置于牌堆顶。②从牌堆底摸一张牌。③获得一名其他角色的一张牌，且可以视为使用无距离限制的【杀】并失去1点体力。",
    },
};
