import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "damageEnd",
        source: "damageSource",
    },
    init: function (player) {
					if (!player.storage.vl_sayisu_fp) player.storage.vl_sayisu_fp = [[], []];
				},
    mark: true,
    direct: true,
    content: function () {
					"step 0"
					player.draw(trigger.num)
					if (game.hasPlayer(function (current) {
						return !player.storage.vl_sayisu_fp[1].includes(current);
					})) {
						player.chooseTarget(get.prompt2('vl_sayisu_fp'), function (card, player, target) {
							return player != target && (!player.storage.vl_sayisu_fp[1] || !player.storage.vl_sayisu_fp[1].includes(target))
						}).set('ai', function (target) { return Math.random() })
					} else {
						event.finish()
					}
					"step 1"
					if (result.bool) {
						event.target = result.targets[0]
						player.logSkill(event.name, event.target)
						if (!player.storage.vl_sayisu_fp) player.storage.vl_sayisu_fp = [[], []];
						if (player.storage.vl_sayisu_fp[0].includes(event.target)) {
							player.chooseBool("是否对" + get.translation(event.target) + "造成1点伤害").set('ai', function () {
								var player = _status.event.player
								var target = _status.event.target
								return get.attitude(player, target) < 0
							}).set('target', event.target)
						} else {
							event.goto(3)
						}
					} else {
						event.finish()
					}
					"step 2"
					if (result.bool) {
						event.target.damage(1, player)
						player.storage.vl_sayisu_fp[1].push(event.target);
						player.storage.vl_sayisu_fp[1].sortBySeat();
						event.finish()
					}
					"step 3"
					player.chooseCard(1, '选择交给' + get.translation(event.target) + '的牌', true).set('ai', function (card) {
						return 100 - get.value(card)
					})
					"step 4"
					if (result.bool) {
						event.target.gain(result.cards, player, 'give')
					}
					if (!player.storage.vl_sayisu_fp[0].includes(event.target)) {
						player.draw(2)
						player.storage.vl_sayisu_fp[0].push(event.target);
						player.storage.vl_sayisu_fp[0].sortBySeat();
					}
				},
    intro: {
        markcount: function (storage) {
						return 0;
					},
        mark: function (dialog, storage, player) {
						if (!storage) return;
						dialog.addText('已发动目标：');
						dialog.addText(get.translation(storage[0]));
						dialog.addText('不可选目标：');
						dialog.addText(get.translation(storage[1]));
					},
        onunmark: function (storage, player) {
						player.storage.vl_edmond_jz = [[], []];
					},
    },
    t: {
        name: "复判",
        info: "当你造成或受到伤害后，你可摸X张牌然后交给一名其他角色一张牌（X为本次伤害值）。若你此前未以此法交给过其牌，你摸两张牌；若你曾以此法交给过其牌，你可对其造成1点伤害，然后其不能再成为此技能的目标。",
    },
};
