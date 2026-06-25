import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    mode: ["identity"],
    filter: function (event, player) {
					var list = [];
					for (var i = 0; i < game.dead.length; i++) {
						if (game.dead[i].maxHp != 0) {
							list.push(game.dead[i].name);
						}
					}
					return list.length > 0;
				},
    content: function () {
					"step 0"
					var list = [];
					for (var i = 0; i < game.dead.length; i++) {
						if (game.dead[i].maxHp != 0) {
							list.push(game.dead[i].name);
						}
					}
					player.chooseButton(ui.create.dialog('选择一名已死亡的角色令其复活', [list, 'character']), function (button) {
						for (var i = 0; i < game.dead.length && game.dead[i].name != button.link; i++);
						return Math.random()
					});
					"step 1"
					if (result.bool) {
						player.loseHp()
						for (var i = 0; i < game.dead.length && game.dead[i].name != result.buttons[0].link; i++);
						var dead = game.dead[i];
						dead.revive(1);
						dead.draw(2);
						var skills = dead.getSkills();
						for (var j = 0; j < skills.length; j++) {
							dead.markSkill(skills[j])
						}
						dead.checkMarks()
						game.broadcastAll(function (player, target, shown) {
							var identity = player.identity;
							if (identity == 'zhu') {
								dead.identity = 'zhong'
							} else {
								dead.identity = identity;
							}
							dead.setIdentity();
						}, player, dead, dead.identityShown);
					}
					'step 2'
					if (get.population('zhong') > Math.ceil((game.players.length + game.dead.length) / 2)  && player.isCharacter('vl_nulia') && game.zhu == player) {
					}
				},
    ai: {
        order: 14,
        result: {
            player: function (player) {
							if (player.hp < 3) return -1;
							if (player.countCards('hs', { name: ['jiu', 'tao'] })) return 1;
							return 0;
						},
        },
        threaten: 2,
    },
    t: {
        name: "渡化",
        info: "出牌阶段限一次，你可以失去1点体力，令一名死亡角色复活至1点体力并摸两张牌，然后将其身份改为与你相同(若你是主公则改为忠臣)。",
    },
};
