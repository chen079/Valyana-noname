import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    init: function (player) {
					player.storage.vl_shark_yz = []
				},
    unique: true,
    initList: function (player) {
					var list;
					if (_status.characterlist) {
						list = [];
						for (var i = 0; i < _status.characterlist.length; i++) {
							var name = _status.characterlist[i];
							if (lib.character[name][1] == 'wei', 'shu', 'qun', 'wu', 'shen', 'jin') list.push(name);
						}
					}
					else if (_status.connectMode) {
						list = get.charactersOL(function (i) {
							return lib.character[i][1] != 'wei', 'shu', 'qun', 'wu', 'shen', 'jin';
						});
					}
					else {
						list = get.gainableCharacters(function (info) {
							return info[1] == 'wei', 'shu', 'qun', 'wu', 'shen', 'jin';
						});
					}
					var players = game.players.concat(game.dead);
					for (var i = 0; i < players.length; i++) {
						list.remove(players[i].name);
						list.remove(players[i].name1);
						list.remove(players[i].name2);
					}
					var banlist = ['vl_shark', 'vl_wore', 'vl_yifa']
					list.remove(banlist);
					player.storage.shark_lib = list
				},
    filter: function (event, player) {
					return player.storage.vl_shark_yz.length
				},
    direct: true,
    content: function () {
					'step 0'
					player.chooseControl(player.storage.vl_shark_yz, 'cancel2').set('prompt', '选择并重铸一个技能').set('prompt2', '你选择一个本技能获得的技能移除之，然后选择四名武将牌上至多一个技能获得之。')
					'step 1'
					if (result.control != 'cancel2') {
						player.removeSkill(result.control)
						player.storage.vl_shark_yz.remove(result.control)
						var list = player.storage.shark_lib.randomGets(4)
						event.list = list
						var skills1 = []
						for (var i = 0; i < list.length; i++) {
							skills1.addArray((lib.character[list[i]][3] || []).filter(function (skill) {
								var info = get.info(skill);
								return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique && !player.hasSkill(skill);
							}));
						}
						player.chooseButtonControl({
							createDialog: ['请选择一个技能', [list, 'character']],
							multibutton: false,
							control: function (buttons) {//（必填）
								var skills = []
								for (var i = 0; i < buttons.length; i++) {
									skills.addArray((lib.character[buttons[i].link][3] || []).filter(function (skill) {
										var info = get.info(skill);
										return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique && !player.hasSkill(skill);
									}));
								}
								return skills;
							},// 
							processAI: function (event, player) {
								var control = skills1.randomGet()
								return {//输出应该长这样
									bool: true,
									links: event.list,
									control: control,
								}
							},
						})
					} else {
						if (player.getStat('skill')['vl_shark_yz']) delete player.getStat('skill')['vl_shark_yz'];
						event.finish();
					}
					'step 2'
					if (result.bool) {
						// console.log(result)
						player.addSkillLog(result.control)
						player.storage.vl_shark_yz.push(result.control)
					}
				},
    ai: {
        order: 7,
        result: {
            player: 1,
        },
    },
    group: "vl_shark_yz_add",
    subSkill: {
        add: {
            trigger: {
                global: "phaseBefore",
                player: ["enterGame"],
            },
            forced: true,
            filter: function filter(event,player){
							return event.name != "phase" || game.phaseNumber == 0;
						},
            content: function () {
							'step 0'
							if (!player.storage.shark_lib) lib.skill.vl_shark_yz.initList(player);
							var list = player.storage.shark_lib.randomGets(4)
							var skills = [];
							for (var i of list) {
								skills.addArray((lib.character[i][3] || []).filter(function (skill) {
									var info = get.info(skill);
									return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique;
								}));
							}
							if (!list.length || !skills.length) { event.finish(); return; }
							if (player.isUnderControl()) {
								game.swapPlayerAuto(player);
							}
							const switchToAuto = function () {
								_status.imchoosing = false;
								event._result = {
									bool: true,
									skills: skills.randomGets(3),
								};
								if (event.dialog) event.dialog.close();
								if (event.control) event.control.close();
							};
							const chooseButton = function (list, skills) {
								var event = _status.event;
								if (!event._result) event._result = {};
								event._result.skills = [];
								var rSkill = event._result.skills;
								//创建dialog
								var dialog = ui.create.dialog('请选择要获得的技能', [list, 'character'], 'hidden');
								event.dialog = dialog;
								//创建table并设定参数
								var table = document.createElement('div');
								table.classList.add('add-setting');
								table.style.margin = '0';
								table.style.width = '100%';
								table.style.position = 'relative';

								for (var i = 0; i < skills.length; i++) {
									var td = ui.create.div('.shadowed.reduce_radius.pointerdiv.tdnode');
									td.link = skills[i];
									table.appendChild(td);
									td.innerHTML = '<span>' + get.translation(skills[i]) + '</span>';
									td.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
										if (_status.dragged) return;
										if (_status.justdragged) return;
										_status.tempNoButton = true;
										setTimeout(function () {
											_status.tempNoButton = false;
										}, 500);
										var link = this.link;
										if (!this.classList.contains('bluebg')) {
											if (rSkill.length >= 3) return;
											rSkill.add(link);
											this.classList.add('bluebg');
										}
										else {
											this.classList.remove('bluebg');
											rSkill.remove(link);
										}
									});
								}
								dialog.content.appendChild(table);
								dialog.add('　　');
								dialog.open();

								event.switchToAuto = function () {
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing = false;
								};
								event.control = ui.create.control('ok', function (link) {
									event.dialog.close();
									event.control.close();
									game.resume();
									_status.imchoosing = false;
								});
								for (var i = 0; i < event.dialog.buttons.length; i++) {
									event.dialog.buttons[i].classList.add('selectable');
								}
								game.pause();
								game.countChoose();
							};
							if (event.isMine()) {
								chooseButton(list, skills);
							}
							else if (event.isOnline()) {
								event.player.send(chooseButton, list, skills);
								event.player.wait();
								game.pause();
							}
							else {
								switchToAuto();
							}
							'step 1'
							var map = event.result || result;
							if (map && map.skills && map.skills.length) {
								for (var i of map.skills) {
									player.addSkillLog(i)
									player.storage.vl_shark_yz.push(i)
								}
							}
							game.broadcastAll(function (list) {
								game.expandSkills(list);
								for (var i of list) {
									var info = lib.skill[i];
									if (!info) continue;
								}
							}, map.skills);
						},
        },
    },
    t: {
        name: "易珠",
        info: "游戏开始时，你获得随机四个武将上的至多三个技能，出牌阶段限一次，你可以失去一个你由本技能获得的技能，然后得随机四个武将上的至多一个非特殊技能。",
    },
};
