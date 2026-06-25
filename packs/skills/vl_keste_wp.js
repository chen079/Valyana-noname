import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "chooseToDebateAfter",
    },
    filter: function (event, player) {
					if (!event.targets.includes(player)) return false;
					if (event.red.map(i => i[0]).includes(player)) return event.black.length;
					if (event.black.map(i => i[0]).includes(player)) return event.red.length;
					return false;
				},
    direct: true,
    content: function () {
					'step 0'
					var targets = [];
					if (trigger.red.map(i => i[0]).includes(player)) targets = trigger.black;
					if (trigger.black.map(i => i[0]).includes(player)) targets = trigger.red;
					player.showHandcards();
					var num = player.countCards('h', 'sha')
					player.chooseTarget([1, num], get.prompt('vl_keste_wp'), '对至多' + get.cnNumber(num) + '名与你意见不同的角色造成1点伤害', (card, player, target) => {
						return _status.event.targets.includes(target);
					}).set('targets', targets.map(i => i[0])).set('ai', target => {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					});
					'step 1'
					if (result.bool) {
						for (var i = 0; i < result.targets.length; i++) {
							var target = result.targets[i];
							target.damage();
						}
					}
				},
    t: {
        name: "威迫",
        info: "当你议事结算结束后，你可以展示所有手牌，然后对至多X名与你意见不同的角色造成1点伤害（X为你的手牌中【杀】数量）。",
    },
};
