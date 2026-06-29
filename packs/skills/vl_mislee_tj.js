import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	enable: "phaseUse",
	usable: 3,
	filter(event, player) {
		let list = ['equip1', 'equip2', 'others'];
		for (let i = 0; i < list.length; i++) {
			if (player.hasSkill('vl_mislee_tj_' + list[i], null, null, false)) list.splice(i--, 1);
		}
		if (!list.length) return false;
		return player.hasCard(function (card) {
			let type = get.type(card);
			if (type != 'equip') return false;
			let subtype = get.subtype(card);
			if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
			return list.includes(subtype);
		}, 'eh');
	},
	filterCard(card, player) {
		let type = get.type(card);
		if (type != 'equip') return false;
		let subtype = get.subtype(card);
		if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
		return !player.hasSkill('vl_mislee_tj_' + subtype, null, null, false);
	},
	position: "he",
	check(card) {
		let val = 7.52 - get.value(card);
		if (val <= 0) return 0;
		let player = _status.event.player;
		if (player.getStorage('vl_mislee_tj_destroy').includes(card)) val += 2;
		return val;
	},
	async content(event, trigger, player) {
		const cards = event.cards;
		let subtype = get.subtype(cards[0]);
		if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
		player.addTempSkill('vl_mislee_tj_' + subtype, 'phaseUseAfter');
		let send = function () {
			game.me.chooseControl('助力锻造！', '妨碍锻造！', '什么都不做');
			game.resume();
		};
		let sendback = function (result, player) {
			if (result) {
				let index = result.index;
				game.log(player, '选择了', ['#b助力锻造', '#g妨碍锻造', '#b什么都不做'][index])
				if (index > 1) return;
				let card = get.cards()[0];
				if (!card) return;
				game.log(player, '展示了', card);
				event.cardsx.push(card);
				event.cards2[index].push(card);
				game.broadcastAll(function (id, card, name, index) {
					let dialog = get.idDialog(id);
					if (!dialog) return;
					let button = ui.create.button(card, 'card', dialog.buttonss[index]);
					button.querySelector('.info').innerHTML = (name + '|' + get.strNumber(card.number));
				}, event.videoId, card, function (target) {
					if (target._tempTranslate) return target._tempTranslate;
					let name = target.name;
					if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
					return get.translation(name);
				}(player), index);
			}
		};
		event.players = game.filterPlayer();
		event.cardsx = [];
		event.cards2 = [[], []];
		event.videoId = lib.status.videoId++;
		event.ai_targets = [];
		game.broadcastAll(function (name, id) {
			let dialog = ui.create.dialog(name + '发起了“锻造”', 'hidden', 'forcebutton');
			dialog.videoId = id;
			dialog.classList.add('scroll1');
			dialog.classList.add('scroll2');
			dialog.classList.add('fullwidth');
			dialog.buttonss = [];

			let list = ['协力锻造的玩家', '妨碍锻造的玩家']
			for (let i = 0; i < list.length; i++) {
				dialog.add('<div class="text center">' + list[i] + '</div>');
				let buttons = ui.create.div('.buttons', dialog.content);
				dialog.buttonss.push(buttons);
				buttons.classList.add('popup');
				buttons.classList.add('guanxing');
			}
			dialog.open();
		}, get.translation(player), event.videoId)
		for (let i = 0; i < event.players.length; i++) {
			if (event.players[i] == player) {
				sendback({ index: 0 }, player);
			}
			else if (event.players[i].isOnline()) {
				event.withol = true;
				event.players[i].send(send);
				event.players[i].wait(sendback);
			}
			else if (event.players[i] == game.me) {
				event.withme = true;
				event.meChooseEvent = game.me.chooseControl('助力锻造！', '妨碍锻造！', '什么都不做');
				if (_status.connectMode) game.me.wait(sendback);
			}
			else {
				event.ai_targets.push(event.players[i]);
				if (_status.connectMode) event.players[i].showTimer();
			}
		}
		if (event.ai_targets.length) {
			event.ai_targets.randomSort();
			setTimeout(function () {
				event.interval = setInterval(function () {
					let target = event.ai_targets.shift();
					let att = get.attitude(target, player);
					let num = 2;
					if (att > 0) num = 0;
					else if (att < 0) num = 1;
					sendback({ index: num }, target);
					if (_status.connectMode) target.hideTimer();
					if (!event.ai_targets.length) {
						clearInterval(event.interval);
						if (event.withai) game.resume();
					}
				}, 750);
			}, 500)
		}
		if (event.withme) {
			const meResult = await event.meChooseEvent.forResult();
			if (_status.connectMode) game.me.unwait(meResult);
			else {
				let index = meResult.index;
				game.log(game.me, '选择了', ['#b助力锻造', '#g妨碍锻造', '#b什么都不做'][index])
				if (index > 1) return;
				let card = get.cards()[0];
				if (!card) return;
				game.log(game.me, '展示了', card);
				event.cardsx.push(card);
				event.cards2[index].push(card);
				game.broadcastAll(function (id, card, name, index) {
					let dialog = get.idDialog(id);
					if (!dialog) return;
					let button = ui.create.button(card, 'card', dialog.buttonss[index]);
					button.querySelector('.info').innerHTML = (name + '|' + get.strNumber(card.number));
				}, event.videoId, card, function (target) {
					if (target._tempTranslate) return target._tempTranslate;
					let name = target.name;
					if (lib.translate[name + '_ab']) return lib.translate[name + '_ab'];
					return get.translation(name);
				}(game.me), index);
			}
		}
		if (event.withol && !event.resultOL) {
			await game.pause();
		}
		if (event.ai_targets.length > 0) {
			event.withai = true;
			await game.pause();
		}
		await game.delay(2);
		let num1 = 0, num2 = 0;
		for (let i of event.cards2[0]) num1 += get.number(i, false);
		for (let i of event.cards2[1]) num2 += get.number(i, false);
		let duanzaoResult = 2;
		if (num1 < num2) duanzaoResult = 0;
		else if (num2 > 0) duanzaoResult = 1;
		event.duanzaoResult = duanzaoResult;
		game.broadcastAll(function (id, result) {
			let dialog = get.idDialog(id);
			if (dialog) dialog.content.firstChild.innerHTML = ['锻造失败…', '锻造成功', '完美锻造！'][result];
		}, event.videoId, duanzaoResult)
		await game.delay();
		await game.cardsGotoOrdering(event.cardsx);
		game.broadcastAll('closeDialog', event.videoId);
		subtype = get.subtype(cards[0]);
		if (subtype != 'equip1' && subtype != 'equip2') subtype = 'others';
		let card_map = {
			equip1: ['wushuangfangtianji', 'guilongzhanyuedao', 'chixueqingfeng', 'bintieshuangji', 'wutiesuolian', 'wuxinghelingshan'],
			equip2: ['linglongshimandai', 'hongmianbaihuapao', 'qimenbagua', 'guofengyupao', 'huxinjing', 'heiguangkai'],
			others: ['shufazijinguan', 'xuwangzhimian', 'tianjitu', 'taigongyinfu', 'sanlve', 'zhaogujing'],
		};
		if (!_status.vl_mislee_tj_map) _status.vl_mislee_tj_map = {};
		if (!_status.vl_mislee_tj_maken) _status.vl_mislee_tj_maken = {};
		let list = card_map[subtype];
		for (let i = 0; i < list.length; i++) {
			let name = list[i];
			if (!lib.card[name] || _status.vl_mislee_tj_map[name]) {
				list.splice(i--, 1);
			}
		}
		if (!list.length) return;
		let chooseResult = await player.chooseButton(['请选择一种装备牌', [list.randomGets(event.duanzaoResult + 1), 'vcard']], true).set('ai', function (button) {
			return get.value({ name: button.link[2] }, player, 'raw');
		}).forResult();
		let name = chooseResult.links[0][2];
		let card;
		if (_status.vl_mislee_tj_maken[name]) card = _status.vl_mislee_tj_maken[name];
		else {
			card = game.createCard(name);
			_status.vl_mislee_tj_maken[name] = card;
		}
		event.card = card;
		player.addSkill('vl_mislee_tj_destroy');
		player.markAuto('vl_mislee_tj_destroy', [card]);
		let cardSubtype = get.subtype(card);
		if (!game.hasPlayer(function (current) {
			return !current.isDisabled(cardSubtype);
		})) {
			return;
			return;
		}
		const targetResult = await player.chooseTarget(true, '将' + get.translation(card) + '置于一名角色的装备区内', function (card, player, target) {
			return !target.isDisabled(_status.event.subtype);
		}).set('subtype', cardSubtype).set('ai', function (target) {
			let card = _status.event.getParent().card, player = _status.event.player;
			return get.effect(target, card, player, player);
		}).forResult();
		if (targetResult.bool) {
			_status.vl_mislee_tj_map[card.name] = true;
			let target = targetResult.targets[0];
			player.line(target, 'green');
			target.$gain2(card);
			await game.delayx();
			await target.equip(card);
		}
	},
	ai: {
		order: 10,
		result: {
			player: 1,
		},
	},
	subSkill: {
		equip1: {
			charlotte: true,
			sub: true,
		},
		equip2: {
			charlotte: true,
			sub: true,
		},
		others: {
			charlotte: true,
			sub: true,
		},
		destroy: {
			trigger: {
				global: ["loseEnd", "cardsDiscardEnd"],
			},
			forced: true,
			charlotte: true,
			popup: false,
			onremove: true,
			filter(event, player) {
				if (event.name == 'lose' && event.position != ui.discardPile) return false;
				let storage = player.getStorage('vl_mislee_tj_destroy', []);
				if (!storage) return false;
				for (let i of event.cards) {
					if (storage.includes(i)) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				let cards = [];
				let storage = player.getStorage('vl_mislee_tj_destroy', []);
				for (let i of trigger.cards) {
					if (storage.includes(i)) {
						delete _status.vl_mislee_tj_map[i.name];
						storage.remove(i);
						cards.push(i);
					}
				}
				game.cardsGotoSpecial(cards);
				game.log(cards, '被移出了游戏');
				player.addTempSkill('vl_mislee_tj_draw');
				player.addMark('vl_mislee_tj_draw', cards.length, false);
				if (!storage.length) player.removeSkill('vl_mislee_tj_destroy');
			},
			sub: true,
		},
		draw: {
			trigger: {
				global: "phaseJieshuBegin",
			},
			forced: true,
			charlotte: true,
			onremove: true,
			filter(event, player) {
				return player.countMark('vl_mislee_tj_draw') > 0;
			},
			async content(event, trigger, player) {
				player.draw(player.countMark('vl_mislee_tj_draw'));
			},
			sub: true,
		},
	},
	t: {
		name: "神工",
		info: `出牌阶段每项限一次。你可以弃置一张武器牌/防具牌/其他装备牌，并发起一次“锻造”。然后你从锻造结果中选择一张牌，置于一名角色的装备区内（可替换原装备）。当有因你发动${get.poptip("vl_mislee_tj")}而加入游戏的牌进入弃牌堆后，你将此牌移出游戏，然后你于当前回合结束后摸一张牌。`,
	},
};
