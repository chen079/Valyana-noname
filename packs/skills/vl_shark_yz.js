import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    init(player) {
					player.storage.vl_shark_yz = []
				},
    unique: true,
    initList(player) {
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
    filter(event, player) {
					return player.storage.vl_shark_yz.length
				},
    direct: true,
    async content(event, trigger, player) {
        const result = await player.chooseControl(player.storage.vl_shark_yz, 'cancel2').set('prompt', '选择并重铸一个技能').set('prompt2', '你选择一个本技能获得的技能移除之，然后选择四名武将牌上至多一个技能获得之。').forResult();
        if (result.control == 'cancel2') {
            if (player.getStat('skill')['vl_shark_yz']) delete player.getStat('skill')['vl_shark_yz'];
            return;
        }
        player.removeSkill(result.control)
        player.storage.vl_shark_yz.remove(result.control)
        var list = player.storage.shark_lib.randomGets(4)
        var skills1 = []
        for (var i = 0; i < list.length; i++) {
            skills1.addArray((lib.character[list[i]][3] || []).filter(function (skill) {
                var info = get.info(skill);
                return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique && !player.hasSkill(skill);
            }));
        }
        const buttonResult = await player.chooseButtonControl({
            createDialog: ['请选择一个技能', [skills1, 'textbutton']],
            multibutton: true,
            control: function () {
                return 'ok';
            },
            filterButton: function (buttons) {
                return buttons.length <= 1;
            },
            processAI: function () {
                var control = skills1.randomGet()
                return {
                    bool: true,
                    links: [control],
                    control: 'ok',
                }
            },
        }).forResult();
        if (buttonResult.bool && buttonResult.links.length) {
            player.addSkillLog(buttonResult.links[0])
            player.storage.vl_shark_yz.push(buttonResult.links[0])
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
            filter(event,player) {
							return event.name != "phase" || game.phaseNumber == 0;
						},
            async content(event, trigger, player) {
                if (!player.storage.shark_lib) lib.skill.vl_shark_yz.initList(player);
                var list = player.storage.shark_lib.randomGets(4)
                var skills = [];
                for (var i of list) {
                    skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                        var info = get.info(skill);
                        return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique;
                    }));
                }
                if (!list.length || !skills.length) { return; }
                const map = await player.chooseButtonControl({
                    createDialog: ['请选择要获得的技能', [skills, 'textbutton']],
                    multibutton: true,
                    control: function () {
                        return 'ok';
                    },
                    filterButton: function (buttons) {
                        return buttons.length <= 3;
                    },
                    processAI: function () {
                        return {
                            bool: true,
                            links: skills.randomGets(3),
                            control: 'ok',
                        };
                    },
                }).forResult();
                if (map.bool && map.links.length) {
                    for (var i of map.links) {
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
                }, map.bool ? map.links : []);
            },
        },
    },
    t: {
        name: "易珠",
        info: "游戏开始时，你获得随机四个武将上的至多三个技能，出牌阶段限一次，你可以失去一个你由本技能获得的技能，然后得随机四个武将上的至多一个非特殊技能。",
    },
};
