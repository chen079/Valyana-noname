import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
	trigger: {
		player: "loseAfter",
	},
	init(player) {
		if (!player.storage.vl_luciya_hl) player.storage.vl_luciya_hl = 0
	},
	usable: 1,
	filter(event, player) {
		return player != _status.currentPhase && event.hs && event.hs.length > 0 && ['useCard', 'respond'].includes(event.getParent().name);
	},
	direct: true,
	intro: {
		content(storage, player, skill) { return '当前判定成功' + storage + '次' },
	},
	mark: true,
	async content(event, trigger, player) {
		const chooseResult = await player.chooseTarget(get.prompt2('vl_luciya_hl'), function (card, player, target) {
			return target != player;
		}).set('ai', function (target) {
			if (target.hasSkill('hongyan')) return 0;
			return get.damageEffect(target, _status.event.player, _status.event.player, 'thunder');
		}).forResult();
		if (!chooseResult.bool) return;
		const target = chooseResult.targets[0];
		const next = target.judge(function (card) {
			if (get.suit(card) == 'spade' && get.number(card) > 1 && get.number(card) < 10) {
				return -4;
			}
			return 0;
		});
		next.judge2 = function (result) {
			return result.bool == false ? true : false;
		};
		const judgeResult = await next.forResult();
		if (judgeResult.bool == false) {
			var num = Math.max(1, player.storage.vl_luciya_hl);
			await target.damage(num, 'thunder', 'nosource');
			player.storage.vl_luciya_hl += 1;
		}
	},
	ai: {
		effect: {
			target(card, player, target, current) {
				var hastarget = game.hasPlayer(function (current) {
					return get.attitude(target, current) < 0;
				});
				var be = target.countCards('e', { color: 'black' });
				if (target.countCards('h') && be) {
					if (!target.hasSkill('guidao')) return 0;
					return [0, hastarget ? target.countCards('he') / 2 : 0];
				}
				if (target.countCards('h') && target.countCards('h') > 2) {
					if (!target.hasSkill('guidao')) return 0;
					return [0, hastarget ? target.countCards('h') / 4 : 0];
				}
				if (target.countCards('h') > 3 || (be && target.countCards('h') >= 2)) {
					return [0, 0];
				}
				if (target.countCards('h') == 0) {
					return [1.5, 0];
				}
				if (target.countCards('h') == 1 && !be) {
					return [1.2, 0];
				}
				if (!target.hasSkill('guidao')) return [1, 0.05];
				return [1, Math.min(0.5, (target.countCards('h') + be) / 4)];
			},
		},
	},
	t: {
		name: "唤雷",
		info: "每回合限一次，当你于回合外使用或打出牌时，你可令任意一名角色进行一次判定。若结果为♠2~9，该角色受到X点无来源的雷属性伤害（X为〖唤雷〗判定成功的次数且至少为1）。",
	},
};
