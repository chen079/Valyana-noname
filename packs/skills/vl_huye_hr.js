import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "chooseToUse",
    filter(event, player) {
					if (event.type != 'dying') return false;
					if (player != event.dying) return false;
					if (player.maxHp <= 1) return false;
					if (player.countCards('h') == 0) return false;
					return true;
				},
    unique: true,
    zhuSkill: true,
    filterTarget(card, player, target) {
					return target != player && target.countCards('h') > 0 && target.hp > 0 && target.hp <= player.maxHp;
				},
    async content(event, trigger, player) {
const result = await player.chooseToCompare(target).forResult();
if (!result.bool) {
        						await player.die();
        						return;
        					}
        					else {
        						event.num = target.hp - player.hp;
        						await player.loseMaxHp();
        					}
await player.changeHp(event.num);
        					if (get.is.altered('vl_huye_hr')) {
        						return;
        					}
await target.changeHp(-event.num);
if (target.hp <= 0) {
        						await target.dying({ source: player });
        					}
    },
    ai: {
        order: 1,
        skillTagFilter(player) {
						if (player.maxHp <= 1) return false;
						if (player.hp > 0) return false;
						if (player.countCards('h') == 0) return false;
					},
        save: true,
        result: {
            target: -1,
            player: 1,
        },
        threaten: 2,
    },
    t: {
        name: "魂落",
        info: "主公技。濒死阶段，你可以与一名体力值不超过你的体力上限的角色拼点，若你赢，你失去1点体力上限并与该角色交换体力值；若你没赢，你立即死亡",
    },
};
