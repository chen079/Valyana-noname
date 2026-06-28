import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseDrawBegin2",
    },
    unique: true,
    dutySkill: true,
    forced: true,
    filter(event, player) {
        return !event.numFixed;
    },
    derivation: "vl_hynea_kb",
    async content(event, trigger, player) {
        trigger.num += Math.ceil(player.getStorage('vl_hynea_cg', 4) / 2)
    },
    group: ["vl_hynea_rx_achieve", "vl_hynea_rx_fail"],
    subSkill: {
        achieve: {
            trigger: {
                player: "phaseZhunbeiBegin",
            },
            filter(event, player) {
                return player.getStorage('vl_hynea_cg', 4) == 0
            },
            forced: true,
            skillAnimation: true,
            animationColor: "fire",
            content(event, player) {
                game.log(player, '成功完成使命');
                player.awakenSkill('vl_hynea_rx');
                player.removeSkill('vl_hynea_ds')
                player.addSkillLog('vl_hynea_kb')
            },
        },
        fail: {
            trigger: {
                player: "dying",
            },
            forced: true,
            async content(event, trigger, player) {
                game.log(player, '使命失败');
                player.awakenSkill('vl_hynea_rx');
                await player.recover(3 - player.hp)
                await player.draw(3)
                await player.loseMaxHp();
            },
            sub: true,
        },
    },
    t: {
        name: "入相",
        info: `使命技，①摸牌阶段，你多摸X张牌（X为你的${get.poptip("vl_hynea_cg")}中[]内的数字的一半并向上取整）。②使命：准备阶段，若${get.poptip("vl_hynea_cg")}中[]内的数字为0，你失去技能${get.poptip("vl_hynea_ds")}并获得技能${get.poptip("vl_hynea_kb")}。③失败：当你进入濒死状态时，你将体力回复至3点，然后你摸3张牌并减少1点体力上限。`,
    },
};
