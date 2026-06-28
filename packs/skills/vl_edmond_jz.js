import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		target: "useCardToTarget",
	},
	forced: true,
	filter(event, player) {
		return event.card.name != 'jiu' && event.card.name != 'tao' && event.getParent(2).name != 'vl_edmond_jj' &&
			event.targets.length == 1 && event.card.isCard && event.cards.length == 1 &&
			get.position(event.cards[0], true) == 'o' && event.card.name == event.cards[0].name && event.player != player &&
			(!player.hasStorage('vl_edmond_jz') || player.getStorage('vl_edmond_jz', [[], []])[0].length <= player.hp * 2)
	},
	async content(event, trigger, player) {
		trigger.targets.remove(player);
		trigger.getParent().triggeredTargets2.remove(player);
		trigger.untrigger();
		let card = trigger.cards[0];
		player.addToExpansion(card, 'gain2').gaintag.add('vl_edmond_jz');
		if (!player.hasStorage('vl_edmond_jz')) player.setStorage('vl_edmond_jz', [[], []]);
		player.getStorage('vl_edmond_jz', [[], []])[0].push(card);
		player.getStorage('vl_edmond_jz', [[], []])[1].push(trigger.player);
		game.delayx();
	},
	onremove(player, skill) {
		let cards = player.getExpansions(skill);
		if (cards.length) player.loseToDiscardpile(cards);
		player.setStorage(skill, [[], []]);
	},
	intro: {
		markcount(storage) {
			if (!storage) return 0;
			return storage[0].length;
		},
		mark(dialog, storage, player) {
			if (!storage) return;
			dialog.addAuto(storage[0]);
			dialog.addText(get.translation(storage[1]));
		},
		onunmark(storage, player) {
			player.setStorage('vl_edmond_jz', [[], []]);
		},
	},
	t: {
		name: "激战",
		info: "锁定技，当你不因〖护幼〗成为其他角色唯一牌的目标时，若此牌不为转化牌且对应的实体牌牌数为1且不为【桃】或【酒】且你的“战”数不大于你的体力值的两倍，则你将此牌置于你的武将牌上，称为“战”，且取消此牌的目标。",
	},
};
