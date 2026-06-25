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
    video(player, data) {
					for (const i in data) {
						const current = game.playerMap[i];
						current.node.handcards1.innerHTML = '';
						current.node.handcards2.innerHTML = '';
						current.node.equips.innerHTML = '';
						current.node.judges.innerHTML = '';
						current.directgain(get.infoCards(data[i].h));
						current.directequip(get.infoCards(data[i].e));
					}
				},
    getinfo(player) {
					const js = player.getCards("j");
					const js2 = [];
					for (let k = 0; k < js.length; k++) {
						const name = js[k].viewAs || js[k].name;
						js2.push(name);
					}
					const isDisabled = [];
					for (let j = 1; j < 7; j++) {
						isDisabled.push(player.isDisabled(j));
					}
					const storage = {
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
    async content(event, trigger, player) {
					player.awakenSkill('vl_molis_hs');
					event.storage = player.storage.vl_molis_hs_save.slice(0);
					while (event.storage.length) {
						const doing = event.storage.shift();
						const target = doing.player;
						if (target.isDead()) target.revive(1);
						target.hp = doing.hp;
						const hs = target.getCards('he');
						if (hs.length) target.lose(hs)._triggered = null;
						const hs2 = [];
						for (let i = 0; i < doing.hs.length; i++) {
							let card = get.cardPile(function (cardx) {
								return cardx == doing.hs[i];
							});
							if (!card) {
								card = game.createCard(doing.hs[i]);
							}
							hs2.push(card);
						}
						if (hs2.length) target.directgain(hs2);
						for (let i = 0; i < doing.isDisabled.length; i++) {
							if (doing.isDisabled[i] == false && target.isDisabled(i + 1)) target.enableEquip(i + 1)._triggered = null;
							if (doing.isDisabled[i] == true && !target.isDisabled(i + 1)) target.disableEquip(i + 1)._triggered = null;
						}
						const es2 = [];
						for (let i = 0; i < doing.es.length; i++) {
							let card = get.cardPile(function (cardx) {
								return cardx == doing.es[i];
							});
							if (!card) {
								card = game.createCard(doing.es[i]);
							}
							es2.push(card);
						}
						if (es2.length) target.directequip(es2);
						target.update();
					}
					game.animate.window(1);
					const data = {};
					for (let i = 0; i < game.players.length; i++) {
						data[game.players[i].dataset.position] = {
							h: get.cardsInfo(game.players[i].getCards('h')),
							e: get.cardsInfo(game.players[i].getCards('e')),
							j: get.cardsInfo(game.players[i].getCards('j'))
						}
					}
					game.addVideo('skill', player, ['vl_molis_hs', data]);
					game.animate.window(2);
					ui.updatehl();
					const cards = get.cards(ui.cardPile.childElementCount + 1);
					for (let i = 0; i < cards.length; i++) {
						ui.cardPile.insertBefore(cards[i], ui.cardPile.childNodes[get.rand(ui.cardPile.childElementCount)]);
					}
					game.updateRoundNumber();
    },
    ai: {
        save: true,
        skillTagFilter(player, arg, target) {
						return player == target && player.storage.vl_molis_hs != true;
					},
        result: {
            player: 10,
        },
        threaten(player, target) {
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
            filter(event, player) {
							if (player.storage.vl_molis_hs) return false;
							return true;
						},
            async content(event, trigger, player) {
							const storage = [];
							const players = game.filterPlayer();
							for (let i = 0; i < players.length; i++) {
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
