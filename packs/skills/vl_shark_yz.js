import { lib, game, get, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    init(player) {
        player.setStorage('vl_shark_yz', [])
    },
    unique: true,
    initList(player) {
        let list;
        if (_status.characterlist) {
            list = [];
            for (let i = 0; i < _status.characterlist.length; i++) {
                let name = _status.characterlist[i];
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
        let players = game.players.concat(game.dead);
        for (let i = 0; i < players.length; i++) {
            list.remove(players[i].name);
            list.remove(players[i].name1);
            list.remove(players[i].name2);
        }
        let banlist = ['vl_shark', 'vl_wore', 'vl_yifa']
        list.remove(banlist);
        player.setStorage('shark_lib', list)
    },
    filter(event, player) {
        return player.getStorage('vl_shark_yz', []).length
    },
    direct: true,
    async content(event, trigger, player) {
        const storage = player.getStorage('vl_shark_yz', []);
        const result = await player.chooseControl(storage, 'cancel2').set('prompt', '选择并重铸一个技能').set('prompt2', '你选择一个本技能获得的技能移除之，然后选择四名武将牌上至多一个技能获得之。').forResult();
        if (result.control == 'cancel2') {
            if (player.getStat('skill')['vl_shark_yz']) delete player.getStat('skill')['vl_shark_yz'];
            return;
        }
        player.removeSkill(result.control)
        storage.remove(result.control)
        let list = player.getStorage('shark_lib', []).randomGets(4)
        let skills1 = []
        for (let i = 0; i < list.length; i++) {
            skills1.addArray((lib.character[list[i]][3] || []).filter(function (skill) {
                let info = get.info(skill);
                return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique && !player.hasSkill(skill);
            }));
        }
        const buttonResult = await player.chooseButton({
            createDialog: ['请选择一个技能', [lib.skill.vl_shark_yz.getSkillButtons(skills1), 'textbutton']],
            selectButton: [1, 1],
            ai(button) {
                return skills1.includes(button.link) ? Math.random() : 0;
            },
        }).forResult();
        if (buttonResult.bool && buttonResult.links.length) {
            player.addSkillLog(buttonResult.links[0])
            storage.push(buttonResult.links[0])
        }
    },
    ai: {
        order: 7,
        result: {
            player: 1,
        },
    },
    getSkillButtons(skills) {
        return skills.map(skill => [
            skill,
            '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + '】</div><div>' + get.skillInfoTranslation(skill) + '</div></div>',
        ]);
    },
    group: "vl_shark_yz_add",
    subSkill: {
        add: {
            trigger: {
                global: "phaseBefore",
                player: ["enterGame"],
            },
            forced: true,
            filter(event, player) {
                return event.name != "phase" || game.phaseNumber == 0;
            },
            async content(event, trigger, player) {
                if (!player.getStorage('shark_lib', null)) lib.skill.vl_shark_yz.initList(player);
                let list = player.getStorage('shark_lib', []).randomGets(4)
                let skills = [];
                for (let i of list) {
                    skills.addArray((lib.character[i][3] || []).filter(function (skill) {
                        let info = get.info(skill);
                        return info && !info.zhuSkill && !info.limited && !info.juexingji && !info.hiddenSkill && !info.charlotte && !info.dutySkill && !info.unique;
                    }));
                }
                if (!list.length || !skills.length) { return; }
                const map = await player.chooseButton({
                    createDialog: ['请选择要获得的技能', [lib.skill.vl_shark_yz.getSkillButtons(skills), 'textbutton']],
                    selectButton: [1, 3],
                    ai(button) {
                        return skills.includes(button.link) ? Math.random() : 0;
                    },
                }).forResult();
                if (map.bool && map.links.length) {
                    for (let i of map.links) {
                        player.addSkillLog(i)
                        player.getStorage('vl_shark_yz', []).push(i)
                    }
                }
                game.broadcastAll(function (list) {
                    game.expandSkills(list);
                    for (let i of list) {
                        let info = lib.skill[i];
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
