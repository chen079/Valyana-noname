import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBefore",
    },
    mark: true,
    filter(event, player) {
					if (!player.storage.vl_milism_th_recode) return true;
					return game.hasPlayer(function (current) {
						return !player.storage.vl_milism_th_recode.includes(current);
					});
				},
    init(player) {
					if (!player.storage.vl_milism_th_recode) player.storage.vl_milism_th_recode = [];
				},
    forced: true,
    async content(event, trigger, player) {
  const result = await player.chooseTarget(1, true).set("filterTarget", function (card, player, target) {
        						return target != player
        					}).set('ai', function (target) {
        						let att = get.attitude(_status.event.player, target);
        						if (att > 0) return att + 1;
        						if (att == 0) return Math.random();
        						return att
        					}).set("prompt", "请选择〖同游〗的目标").forResult();
if (!player.storage.vl_milism_th_recode) player.storage.vl_milism_th_recode = [];
        					player.storage.vl_milism_th_recode[0] = result.targets[0];
    },
    intro: {
        content(storage, player, skill) {
						let str = '当前〖同游〗目标：';
						str += "<span style='color: red'>" + get.translation(player.storage.vl_milism_th_recode) + "</span>";
						return str;
					},
    },
    group: ["vl_milism_th_1", "vl_milism_th_2"],
    subSkill: {
        "1": {
            trigger: {
                global: "damageBefore",
            },
            locked: true,
            filter(event, player) {
							return event.player == player.storage.vl_milism_th_recode[0]
						},
            check(event, player) {
							let target = event.player;
							if (player.hp == 1) return false
							if (target.hp == target.maxHp) return false
							if (get.attitude(player, target) < 0) return false;
							return true
						},
            logTarget: "player",
            async content(event, trigger, player) {
							trigger.cancel();
							player.damage(trigger.source, trigger.nature)
						},
            sub: true,
        },
        "2": {
            trigger: {
                global: "recoverBegin",
            },
            filter(event, player) {
							return event.player == player.storage.vl_milism_th_recode[0]
						},
            forced: true,
            async content(event, trigger, player) {
							player.recover()
						},
            sub: true,
        },
        recode: {
            sub: true,
        },
    },
    t: {
        name: "同游",
        info: "锁定技，回合开始时，你须选择一名其他角色，若如此做，直到你的下个回合开始，该角色受到伤害前，你可以免除之。然后你受到1点同属性同来源的伤害；当该角色回复体力时，你回复1点体力。",
    },
};
