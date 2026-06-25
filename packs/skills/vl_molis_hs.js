import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    group: "vl_molis_hs_record",
    skillAnimation: true,
    animationColor: "gray",
    unique: true,
    limited: true,
    mark: true,
    intro: {
        content: "limited",
    },
    trigger: {
        player: "dying",
    },
    video: function (player, data) {
					for (var i in data) {
						var current = game.playerMap[i];
						current.node.handcards1.innerHTML = '';
						current.node.handcards2.innerHTML = '';
						current.node.equips.innerHTML = '';
						current.node.judges.innerHTML = '';
						current.directgain(get.infoCards(data[i].h));
						current.directequip(get.infoCards(data[i].e));
					}
				},
    getinfo: function (player) {
					var js = player.getCards("j");
					var js2 = [];
					for (var k = 0; k < js.length; k++) {
						var name = js[k].viewAs || js[k].name;
						js2.push(name);
					}
					var isDisabled = [];
					for (var j = 1; j < 7; j++) {
						isDisabled.push(player.isDisabled(j));
					}
					var storage = {
						player: player,
						hs: player.getCards("h"),
						es: player.getCards("e"),
						isDisabled: isDisabled,
						hp: player.hp,
						maxHp: player.maxHp,
						_disableJudge: player.storage._disableJudge,
						isTurnedOver: player.isTurnedOver(),
						isLinked: player.isLinked(),
						js: js,
						js2: js2,
					};
					return storage;
				},
    content: function () {
					'step 0'
					player.awakenSkill('vl_molis_hs');
					event.storage = player.storage.vl_molis_hs_save.slice(0);
					'step 1'
					event.doing = event.storage.shift();
					event.target = event.doing.player;
					'step 2'
					if (target.isDead()) target.revive(1);
					'step 3'
					var hp = event.doing.hp;
					target.hp = hp;
					var hs = target.getCards('he');
					if (hs.length) target.lose(hs)._triggered = null;
					'step 4'
					var hs = event.doing.hs;
					var hs2 = [];
					for (var i = 0; i < hs.length; i++) {
						var card = get.cardPile(function (cardx) {
							return cardx == hs[i];
						});
						if (!card) {
							card = game.createCard(hs[i]);
						}
						hs2.push(card);
					}
					if (hs2.length) target.directgain(hs2);
					'step 5'
					var isDisabled = event.doing.isDisabled;
					for (var i = 0; i < isDisabled.length; i++) {
						if (isDisabled[i] == false && target.isDisabled(i + 1)) target.enableEquip(i + 1)._triggered = null;
						if (isDisabled[i] == true && !target.isDisabled(i + 1)) target.disableEquip(i + 1)._triggered = null;
					}
					'step 6'
					var es = event.doing.es;
					var es2 = [];
					for (var i = 0; i < es.length; i++) {
						var card = get.cardPile(function (cardx) {
							return cardx == es[i];
						});
						if (!card) {
							card = game.createCard(es[i]);
						}
						es2.push(card);
					}
					if (es2.length) target.directequip(es2);
					'step 7'
					target.update();
					'step 8'
					if (event.storage.length) event.goto(1);
					'step 9'
					game.animate.window(1);
					var data = {};
					for (var i = 0; i < game.players.length; i++) {
						data[game.players[i].dataset.position] = {
							h: get.cardsInfo(game.players[i].getCards('h')),
							e: get.cardsInfo(game.players[i].getCards('e')),
							j: get.cardsInfo(game.players[i].getCards('j'))
						}
					}
					game.addVideo('skill', player, ['vl_molis_hs', data]);
					game.animate.window(2);
					ui.updatehl();
					'step 10'
					var cards = get.cards(ui.cardPile.childElementCount + 1);
					for (var i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
					game.updateRoundNumber();
				},
    ai: {
        save: true,
        skillTagFilter: function (player, arg, target) {
						return player == target && player.storage.vl_molis_hs != true;
					},
        result: {
            player: 10,
        },
        threaten: function (player, target) {
						if (!target.storage.vl_molis_hs) return 0.9;
					},
    },
    subSkill: {
        record: {
            trigger: {
                global: "roundStart",
            },
            popup: false,
            silent: true,
            firstDo: true,
            forced: true,
            filter: function (event, player) {
							if (player.storage.vl_molis_hs) return false;
							return true;
						},
            content: function () {
							var storage = [];
							var players = game.filterPlayer();
							for (i = 0; i < players.length; i++) {
								storage.push(lib.skill.vl_molis_hs.getinfo(players[i]));
							}
							player.storage.vl_molis_hs_save = storage;
						},
            sub: true,
        },
    },
    t: {
        name: "回溯",
        info: "限定技，当你进入濒死状态时，你可以将场上的卡牌复原到本轮开始时的状态（包括武将牌和体力牌，死亡角色会先以1血复活）。",
    },
};
