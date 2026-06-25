import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "dieBefore",
    },
    filter: function (event, player) {
					return player.getStorage('vl_kulun_zn').length && event.getParent().name != 'giveup' && player.maxHp > 0;
				},
    forced: true,
    direct: true,
    priority: 15,
    group: ["vl_kulun_fs_die", "vl_kulun_fs_return"],
    content: function () {
					if (_status.vl_kulun_fs_return && _status.vl_kulun_fs_return[player.playerid]) {
						trigger.cancel();
					}
					else {
						player.logSkill('vl_kulun_fs');
						trigger.setContent(lib.skill.vl_kulun_fs.dieContent);
						trigger.includeOut = true;
					}
				},
    ai: {
        combo: "vl_kulun_zn",
    },
    dieContent: function () {
					'step 0'
					event.forceDie = true;
					if (source) {
						game.log(player, '被', source, '杀害');
						if (source.stat[source.stat.length - 1].kill == undefined) {
							source.stat[source.stat.length - 1].kill = 1;
						}
						else {
							source.stat[source.stat.length - 1].kill++;
						}
					}
					else {
						game.log(player, '阵亡');
					}
					if (player.isIn() && (!_status.vl_kulun_fs_return || !_status.vl_kulun_fs_return[player.playerid])) {
						event.reserveOut = true;
						game.log(player, '进入了修整状态');
						game.log(player, '移出了游戏');
						//game.addGlobalSkill('vl_kulun_fs_return');
						if (!_status.vl_kulun_fs_return) _status.vl_kulun_fs_return = {};
						_status.vl_kulun_fs_return[player.playerid] = 1;
					}
					else event.finish();
					if (!game.countPlayer()) game.over();
					else if (player.hp != 0) {
						player.changeHp(0 - player.hp, false).forceDie = true;
					}
					game.broadcastAll(function (player) {
						if (player.isLinked()) {
							if (get.is.linked2(player)) {
								player.classList.toggle('linked2');
							}
							else {
								player.classList.toggle('linked');
							}
						}
						if (player.isTurnedOver()) {
							player.classList.toggle('turnedover');
						}
					}, player);
					game.addVideo('link', player, player.isLinked());
					game.addVideo('turnOver', player, player.classList.contains('turnedover'));
					'step 1'
					event.trigger('die');
					'step 2'
					if (event.reserveOut) {
						if (!game.reserveDead) {
							for (var mark in player.marks) {
								if (mark == 'vl_kulun_zn') continue;
								player.unmarkSkill(mark);
							}
							var count = 1;
							var list = Array.from(player.node.marks.childNodes);
							if (list.some(i => i.name == 'vl_kulun_zn')) count++;
							while (player.node.marks.childNodes.length > count) {
								var node = player.node.marks.lastChild;
								if (node.name == 'vl_kulun_zn') {
									node = node.previousSibling;
								}
								node.remove();
							}
							game.broadcast(function (player, count) {
								while (player.node.marks.childNodes.length > count) {
									var node = player.node.marks.lastChild;
									if (node.name == 'vl_kulun_zn') {
										node = node.previousSibling;
									}
									node.remove();
								}
							}, player, count);
						}
						for (var i in player.tempSkills) {
							player.removeSkill(i);
						}
						var skills = player.getSkills();
						for (var i = 0; i < skills.length; i++) {
							if (lib.skill[skills[i]].temp) {
								player.removeSkill(skills[i]);
							}
						}
						event.cards = player.getCards('hejsx');
						if (event.cards.length) {
							player.discard(event.cards).forceDie = true;
						}
					}
					'step 3'
					if (event.reserveOut) {
						game.broadcastAll(function (player, list) {
							player.classList.add('out');
							if (list.includes(player.name1) || player.name1 == 'vl_kulun') {
								player.changeAvatarImage(player.name1, player.name1 + '_die')
							}
							if (list.includes(player.name2) || player.name2 == 'vl_kulun') {
								player.changeAvatarImage(player.name2, player.name2 + '_die')
							}
						}, player, lib.skill.vl_kulun_zn.element.map(i => i[0]));
					}
				},
    subSkill: {
        die: {
            trigger: {
                player: "phaseAfter",
            },
            forced: true,
            forceDie: true,
            content: function () {
							'step 0'
							if (lib.skill.vl_kulun_zn.isSingleElement(player)) {
								if (!player.getStorage('vl_kulun_zn').length) {
									game.broadcastAll(function (player) {
										player.name1 = player.name;
										player.changeAvatarImage(player.name, player.name);
										player.node.name.innerHTML = get.slimName(player.name);
										delete player.name2;
										player.classList.remove('fullskin2');
										player.node.avatar2.classList.add('hidden');
										player.node.name2.innerHTML = '';
										if (player == game.me && ui.fakeme) {
											ui.fakeme.style.backgroundImage = player.node.avatar.style.backgroundImage;
										}
									}, player);
								}
							}
							if (!player.getStorage('vl_kulun_zn').length) {
								game.delay();
							}
							'step 1'
							player.die();
						},
            sub: true,
            _priority: 0,
        },
        return: {
            trigger: {
                player: "phaseBefore",
            },
            forced: true,
            charlotte: true,
            silent: true,
            forceDie: true,
            forceOut: true,
            filter: function (event, player) {
							return !event._vl_kulun_fs_return && event.player.isOut() && _status.vl_kulun_fs_return[event.player.playerid];
						},
            content: function () {
							'step 0'
							trigger._vl_kulun_fs_return = true;
							game.broadcastAll(function (player) {
								player.classList.remove('out');
							}, trigger.player);
							game.log(trigger.player, '移回了游戏');
							delete _status.vl_kulun_fs_return[trigger.player.playerid];
							trigger.player.recover(trigger.player.maxHp - trigger.player.hp);
							game.broadcastAll(function (player) {
								if (player.name1 == 'vl_kulun') {
									player.smoothAvatar(false);
									player.node.avatar.setBackground(player.name1, 'character');
								}
								if (player.name2 == 'vl_kulun') {
									player.smoothAvatar(true);
									player.node.avatar2.setBackground(player.name2, 'character');
								}
							}, trigger.player);
							'step 1'
							event.trigger('restEnd');
						},
            sub: true,
            popup: false,
            _priority: 1,
        },
    },
    _priority: 1500,
    t: {
        name: "反噬",
        info: "锁定技。①当你死亡前，若你有未注入过的元素且你的体力上限大于0，你改为「xiuzheng」。②回合结束后，你死亡。",
    },
};
