import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	getHuCards(player) {
		return player.getExpansions('vl_azao_huxi');
	},
	async addHuCards(player, cards) {
		if (!cards || !cards.length) return;
		if (player.getStorage('vl_azao_huxi_hand', false)) {
			await player.gain(cards, 'gain2').gaintag.add('vl_azao_huxi_hand');
		} else {
			await player.addToExpansion(cards, 'gain2').gaintag.add('vl_azao_huxi');
			player.markSkill('vl_azao_huxi');
			game.log(player, '将', cards, '作为“护”置于武将牌上');
		}
	},
	async resolveGuard(player) {
		player.setStorage('vl_azao_huxi_count', player.getStorage('vl_azao_huxi_count', 0) + 1);
		const num = Math.max(1, player.getStorage('vl_azao_huxi_count', 0));
		await player.loseHp();
		const cards = get.cards(num);
		await game.cardsGotoOrdering(cards);
		let selected;
		if (cards.length <= 1) {
			selected = cards.slice(0);
		} else {
			const result = await player.chooseCardButton(1, '护契：将其中一张牌作为“护”' + (player.getStorage('vl_azao_huxi_hand', false) ? '放入手牌' : '置于你的武将牌上'), true, cards)
				.set('ai', button => get.value(button.link, _status.event.player))
				.forResult();
			selected = result.links || cards.slice(0, 1);
		}
		const rest = cards.slice(0);
		rest.removeArray(selected);
		await lib.skill.vl_azao_huxi.addHuCards(player, selected);
		if (rest.length) await game.cardsGotoPile(rest.reverse(), 'insert');
	},
	async chooseQizhe(player) {
		const result = await player.chooseTarget(get.prompt('vl_azao_huxi'), '令一名其他角色获得“契者”标记', function (card, player, target) {
			return target != player;
		}).set('ai', function (target) {
			return get.attitude(_status.event.player, target);
		}).forResult();
		if (!result.bool) return;
		const target = result.targets[0];
		player.logSkill('vl_azao_huxi', target);
		game.countPlayer(current => {
			if (current != target && current.countMark('vl_azao_huxi_qizhe')) current.removeMark('vl_azao_huxi_qizhe', current.countMark('vl_azao_huxi_qizhe'));
		});
		target.addMark('vl_azao_huxi_qizhe', 1);
	},
	trigger: {
		global: "gameStart",
		player: "enterGame",
	},
	forced: true,
	filter(event, player) {
		return event.name != 'phase' || game.phaseNumber == 0;
	},
	init(player) {
		if (typeof player.getStorage('vl_azao_huxi_count', 0) != 'number') player.setStorage('vl_azao_huxi_count', 0);
	},
	marktext: "护",
	intro: {
		markcount: "expansion",
		mark(dialog, storage, player) {
			const cards = lib.skill.vl_azao_huxi.getHuCards(player);
			if (cards.length) dialog.addAuto(cards);
			else return '暂无“护”';
		},
	},
	onremove(player) {
		const cards = lib.skill.vl_azao_huxi.getHuCards(player);
		if (cards.length) player.loseToDiscardpile(cards);
		player.setStorage('vl_azao_huxi_count', 0);
		player.setStorage('vl_azao_huxi_hand', false);
	},
	async content(event, trigger, player) {
		await lib.skill.vl_azao_huxi.chooseQizhe(player);
	},
	group: ["vl_azao_huxi_prevent", "vl_azao_huxi_recover"],
	subSkill: {
		prevent: {
			trigger: {
				global: "damageBegin3",
			},
			filter(event, player) {
				return event.num > 0 && (event.player.countMark('vl_azao_huxi_qizhe') > 0 || (event.player == player));
			},
			logTarget: "player",
			prompt2(event, player) {
				return '防止' + get.translation(event.player) + '即将受到的' + get.cnNumber(event.num) + '点伤害，然后移除“契者”标记，你流失1点体力并结算“护”。';
			},
			check(event, player) {
				return event.player == player || get.attitude(player, event.player) > 0;
			},
			async content(event, trigger, player) {
				trigger.cancel();
				game.countPlayer(current => {
					if (current.countMark('vl_azao_huxi_qizhe')) current.removeMark('vl_azao_huxi_qizhe', current.countMark('vl_azao_huxi_qizhe'));
				});
				await lib.skill.vl_azao_huxi.resolveGuard(player);
				await lib.skill.vl_azao_huxi.chooseQizhe(player);
			},
			sub: true,
		},
		recover: {
			trigger: {
				global: "recoverAfter",
			},
			forced: true,
			filter(event, player) {
				return event.player != player && event.player.countMark('vl_azao_huxi_qizhe') > 0 && event.num > 0 && player.isDamaged();
			},
			logTarget: "player",
			async content(event, trigger, player) {
				await player.recover(trigger.num);
			},
			sub: true,
		},
		qizhe: {
			charlotte: true,
			marktext: "契",
			intro: {
				content: "契者",
			},
			sub: true,
		},
	},
	derivation: "vl_azao_qihui",
	t: {
		name: "护契",
		info: "锁定技，游戏开始时，你可以令一名其他角色获得“契者”标记。当“契者”或你将受到伤害时，你可以防止此伤害并移除标记，然后你流失1点体力并观看牌堆顶X张牌，将其中一张置于你的武将牌上，称之为“护”（X为你发动此技能的次数且至少为1）。然后，你可以令一名其他角色获得“契者”标记。当“契者”回复体力后，你回复等量体力。",
        taici: ['一息尚存，暗潮不止。', '随我的呼吸，坠入深渊。'],
    },
};
