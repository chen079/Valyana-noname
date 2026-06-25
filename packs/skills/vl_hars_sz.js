import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: ["dieBegin"],
    },
    priority: -1,
    filter(event, player) {
					return event.player.hp <= 0 && !event.player.hasSkill('vl_hars_yb') && player.isAlive() && event.player != player;
				},
    logTarget: "player",
    content: async function content(event, trigger, player) {
					trigger.cancel();
					if (trigger.player.isDead()) {
						await trigger.player.revive();
						trigger.player.hp = 0;
						trigger.player.update();
						game.log(trigger.player, '当前的体力值为[' + trigger.player.hp + ']。');
					}
					if (!trigger.player.hasSkill('vl_hars_yb')) {
						trigger.player.addSkill('vl_hars_yb');
					}
				},
    ai: {
        respondTao: false,
        save: false,
        expose: 0.2,
        threaten: 8,
        result: {
            player: 10,
            target: 1,
        },
    },
    derivation: "vl_hars_yb",
    group: "vl_hars_sz_1",
    subSkill: {
        "1": {
            direct: true,
            trigger: {
                global: "phaseBeginStart",
            },
            filter(event, player) {
							return player != event.player && !event.player._trueMe && event.player.hasSkill('vl_hars_yb');
						},
            logTarget: "player",
            skillAnimation: true,
            animationColor: "key",
            async content(event, trigger, player) {
							trigger.player._trueMe = player;
							game.addGlobalSkill('autoswap');
							if (trigger.player == game.me) {
								game.notMe = true;
								if (!_status.auto) ui.click.auto();
							}
							trigger.player.addSkill('vl_hars_sz_2');
						},
            sub: true,
        },
        "2": {
            trigger: {
                player: ["phaseAfter"],
                global: "phaseBefore",
            },
            lastDo: true,
            charlotte: true,
            forceDie: true,
            forced: true,
            silent: true,
            async content(event, trigger, player) {
							player.removeSkill('vl_hars_sz_2');
						},
            onremove(player) {
							if (player == game.me) {
								if (!game.notMe) game.swapPlayerAuto(player._trueMe)
								else delete game.notMe;
								if (_status.auto) ui.click.auto();
							}
							delete player._trueMe;
						},
            popup: false,
            sub: true,
        },
    },
    t: {
        name: "傀炼",
        info: "其他角色死亡时，你可以令其获得技能“傀尸”。拥有技能“傀尸”的角色回合即将开始时，此回合改为由你操控。",
    },
};
