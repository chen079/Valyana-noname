import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: ["chooseToUse", "chooseToRespond"],
    prompt: "将红色牌当做【闪】，黑色牌当做【无懈可击】使用或打出",
    viewAs: function (cards, player) {
					var name = false;
					switch (get.color(cards[0], player)) {
						case 'red': name = 'shan'; break;
						case 'black': name = 'wuxie'; break;
					}
					if (name) return { name: name, number: get.number(cards[0]), suit: get.suit(cards[0]) };
					return null;
				},
    mark: true,
    intro: {
        mark: function (dialog, storage, player) {
						var evt = player.getLastAllUsed()
						if (evt && evt.card) {
							dialog.addText('你上一张使用的牌为' + get.translation(evt.card.name) + '【' + get.translation(evt.card.suit) + get.translation(evt.card.number) + '】');
						}
					},
    },
    position: "hes",
    filterCard: function (card, player, event) {
					event = event || _status.event;
					var filter = event._backup.filterCard;
					var name = get.color(card, player);
					if (name == 'red' && filter({ name: 'shan', cards: [card] }, player, event)) return true;
					if (name == 'black' && filter({ name: 'wuxie', cards: [card] }, player, event)) return true;
					return false;
				},
    filter: function (event, player) {
					var filter = event.filterCard;
					if (filter({ name: 'shan' }, player, event) && player.countCards('hes', { color: 'red' } > 0)) return true;
					if (filter({ name: 'wuxie' }, player, event) && player.countCards('hes', { color: 'black' })) return true;
					return false;
				},
    precontent: function () {
					var evt = player.getLastAllUsed()
					var card = event.result.cards[0]
					if (evt && evt.card) {
						if (player.storage.vl_dmoa_sg === '点数不大于其') {
							if (get.number(evt.card) >= get.number(card)) player.draw();
						} else if (player.storage.vl_dmoa_sg === '点数不小于其') {
							if (get.number(evt.card) <= get.number(card)) player.draw();
						} else if (player.storage.vl_dmoa_sg === '颜色与其不同') {
							if (get.color(evt.card) != get.color(card)) player.draw();
						} else if (player.storage.vl_dmoa_sg === '类型与其相同') {
							if (get.type2(evt.card) == get.type2(card)) player.draw();
						}
					}
				},
    ai: {
        respondSha: true,
        respondShan: true,
        skillTagFilter: function (player, tag) {
						var name;
						switch (tag) {
							case 'respondSha': name = 'black'; break;
						}
						if (!player.countCards('hes', { color: name })) return false;
					},
        order: 2,
    },
    hiddenCard: function (player, name) {
					if (name == 'wuxie' && _status.connectMode && player.countCards('hes') > 0) return true;
					if (name == 'wuxie') return player.countCards('hes', { color: 'black' }) > 0;
				},
    _priority: 0,
    t: {
        name: "音护",
        info: "你可以将一张红色/黑色牌当做【闪】/【无懈可击】使用打出，此时若对上一张你使用的牌满足“笙歌”条件，你摸一张牌。",
    },
};
