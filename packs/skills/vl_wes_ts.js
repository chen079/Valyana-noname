import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "roundStart",
        player: "enterGame",
    },
    direct: true,
    filter: function (event, player) {
					return game.players.length > 1;
				},
    content: function () {
					'step 0'
					if (!player.storage.vl_wes_ts) player.storage.vl_wes_ts = [];
					game.findPlayer2(function (current) {
						if (player.storage.vl_wes_ts && player.storage.vl_wes_ts.includes(current)) {
							player.storage.vl_wes_ts.remove(current);
							current.removeSkill('vl_wes_ts_a');
							current.removeSkill('vl_wes_gc')
						}
					});
					if (player.storage.vl_wes_ts.length == 0) player.unmarkSkill('vl_wes_ts');
					player.chooseTarget('请选择〖同生〗的目标', lib.translate.vl_wes_ts_info, function (card, player, target) {
						return target != player && !target.hasSkill('vl_wes_ts_a');
					}).set('ai', function (target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) return att + 1;
						return Math.random();
					}).animate = false;
					'step 1'
					if (result.bool) {
						var target = result.targets[0];
						player.line(target);
						player.storage.vl_wes_ts.push(target);
						target.addSkill('vl_wes_ts_a');
						target.addSkill('vl_wes_gc')
						player.markSkill('vl_wes_ts');
					} else {
						event.finish()
					}
				},
    unique: true,
    charlotte: true,
    intro: {
        content: function (storage, player, skill) {
						var str = '当前〖同生〗目标：';
						str += "<span style='color: red'>" + get.translation(player.storage.vl_wes_ts) + "</span>";
						return str;
					},
    },
    subSkill: {
        a: {
            charlotte: true,
            silent: true,
            popup: false,
            trigger: {
                target: ["useCardToTargeted"],
            },
            forced: true,
            filter: function (event, player) {
							if (!player.isIn()) return false;
							if (event.player == player) return false;
							return game.countPlayer(function (current) {
								if (current.storage.vl_wes_ts && current.storage.vl_wes_ts.includes(player) && event.player != current) return true;
							});
							return false;
						},
            content: function () {
							'step 0'
							game.countPlayer(function (current) {
								if (current.storage.vl_wes_ts && current.storage.vl_wes_ts.includes(player)) {
									current.logSkill('vl_wes_ts', player);
									trigger.targets.remove(player);
									trigger.targets.push(current);
									trigger.player.line(current);
								}
							});
							'step 1'
							game.delay(1.5);
						},
            onremove: function (player) {
							game.findPlayer2(function (current) {
								if (current.storage.vl_wes_ts && current.storage.vl_wes_ts.includes(player)) {
									current.storage.vl_wes_ts.remove(player);
									if (!current.storage.vl_wes_ts.length) current.unmarkSkill('vl_wes_ts');
									else current.markSkill('vl_wes_ts');
								}
							});
						},
            sub: true,
        },
    },
    t: {
        name: "同生",
        info: "锁定技。一轮游戏开始时，你可以指定一名其他角色，该角色获得「vl_wes_gc」直到你下一次发动此技能，并令除你与其以外的角色指定该角色为目标时，该角色将目标转移给你。",
    },
};
