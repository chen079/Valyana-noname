import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard1",
    },
    frequent: true,
    filter(event, player) {
					if (event._huanjue) return false;
					if (event.targets.length != 1) return false;
					const target = event.targets[0];
					for (let i = 0; i < lib.inpile.length; i++) {
						const info = lib.card[lib.inpile[i]];
						if (info.multitarget) continue;
						if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, event.player, target)) {
							return true;
						}
					}
					return false;
				},
    autodelay: true,
    async content(event, trigger, player) {
					const list = [], list1 = [], list2 = [];
        					for (let i = 0; i < lib.inpile.length; i++) {
        						const info = lib.card[lib.inpile[i]];
        						if (info.multitarget) continue;
        						if (lib.filter.targetEnabled2({ name: lib.inpile[i] }, trigger.player, trigger.targets[0])) {
        							const cardinfo = [trigger.card.suit || '', trigger.card.number || '', lib.inpile[i]];
        							list1.push(cardinfo);
        							if (info.type != 'equip') {
        								list2.push(cardinfo);
        							}
        						}
        					}
        					let equipped = false;
        					for (let i = 0; i < 3; i++) {
        						if (equipped && list2.length) {
        							list.push(list2.randomRemove());
        						}
        						else {
        							equipped = true;
							list.push(list1.randomRemove());
						}
					}
					const eff1 = get.effect(trigger.targets[0], trigger.card, trigger.player, player);
					const val1 = get.value(trigger.card, player, 'raw');
					const result = await player.chooseButton(['水月', [list, 'vcard']]).forResult();
					if (result && result.bool) {
        						const stat = player.stat[player.stat.length - 1].card;
        						if (stat[trigger.card.name]) {
        							stat[trigger.card.name]--;
        						}
        						const card = game.createCard({
        							suit: trigger.card.suit || lib.suit.randomGet(),
        							number: trigger.card.number || Math.ceil(Math.random() * 13),
        							name: result.links[0][2]
        						}
        						);
        						event.card = card;
        						game.log(player, '将', trigger.card, '变为', card);
        						// if(!event.isMine()) game.delayx();
        						trigger.card = get.autoViewAs(card);
        						trigger.cards = [card];
        						game.cardsGotoOrdering(card).relatedEvent = trigger;
        						trigger._huanjue = true;
        					}
        					else {
        						return;
        					}
					player.$throw(event.card, null, null, true);
        					if (player == trigger.player) {
        						player.line(trigger.targets[0], 'green');
        					}
        					else {
        						player.line(trigger.player, 'green');
        					}
        					game.delayx(0.5);
					const stat = player.stat[player.stat.length - 1].card;
        					if (!stat[trigger.card.name]) {
        						stat[trigger.card.name] = 1;
        					}
        					else {
        						stat[trigger.card.name]++;
        					}
    },
    draw() {
					player.draw();
				},
    ai: {
        usedu: true,
    },
    t: {
        name: "水月",
        info: `当你对唯一目标声明使用一张牌时，你可以${get.poptip("rule_faxian")}一张牌代替此牌结算。`,
    },
};
