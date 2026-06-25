import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    usable: 1,
    direct: true,
    shaRelated: true,
    filter: function (event, player) {
					return event.card.name == 'sha'
				},
    content: function () {
					'step 0'
					var map = {};
					var list = [];
					for (var i = 1; i <= player.hp; i++) {
						var cn = get.cnNumber(i, true);
						list.push(cn + '点');
					}
					event.map = map;
					player.chooseControl(list, 'cancel2').set('prompt', '强破：请选择失去体力的点数').set('ai', function () {
						var player = _status.event.player
						var target = _status.event.target
						if (player.hp >= 3 && get.attitude(player, target) < 0) {
							return '2点'
						} else if (player.hp == 2 && get.attitude(player, target) < 0) {
							return '1点'
						} else {
							return 'cancel2'
						}
					}).set('target', trigger.target);
					'step 1'
					if (result.control != 'cancel2') {
						var num = result.index + 1
						event.num = num > 1 ? 2 : 1;
						player.loseHp(num);
						player.line(trigger.target, { color: [255, 224, 172] });
						player.addTempSkill('unequip', { player: 'useCardAfter' })
						var id = trigger.target.playerid;
						var map = trigger.customArgs;
						if (!map[id]) map[id] = {};
						if (!map[id].extraDamage) map[id].extraDamage = 0;
						map[id].extraDamage += event.num;
					} else {
						event.finish()
					}
				},
    ai: {
        unequip: true,
        unequip_ai: true,
        skillTagFilter: function skillTagFilter(player, tag, arg) {
						if (tag == "unequip" && (!arg?.card || !player.hasSkill("unquip")) ) {
							return false;
						}
						if (tag == "unequip_ai" && (!arg || arg.name != "sha")) {
							return false;
						}
					},
    },
    t: {
        name: "强破",
        info: "「xuli」，每回合限一次，当你使用【杀】指定目标后，你可以失去<font color=#ffff7a>1</font>点体力，令此【杀】伤害+<font color=#eb6e3a>1</font>且无视防具。",
    },
};
