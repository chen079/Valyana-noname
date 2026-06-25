import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init(player) {
					if (!player.vl_pluvia_xs) player.vl_pluvia_xs = '平';
				},
    filter(event, player) {
					if (player.vl_pluvia_xs == '平') {
						return player.countCards('hs', 'shan') > 0 && game.hasPlayer(function (current) {
							return current.isDamaged();
						});
					} else {
						return player.countCards('hs', 'sha') > 0
					}
				},
    filterTarget(card, player, target) {
					if (player.vl_pluvia_xs == '平') {
						if (target.hp >= target.maxHp) return false;
						return true;
					} else {
						return target != player
					}
				},
    position: "hs",
    mark: true,
    filterCard(card, player, target) {
					if (player.vl_pluvia_xs == '平') {
						return get.name(card, player) == 'shan'
					} else {
						return get.name(card, player) == 'sha'
					}
				},
    marktext: "🎶",
    intro: {
        content(storage, player) {
						let str;
						switch (player.vl_pluvia_xs) {
							case '平': str = '出牌阶段限一次，你可以弃置一张【桃】，然后令一名角色回复1点体力'; break;
							case '仄': str = '出牌阶段限一次，你可以弃置一张【杀】，然后对一名其他角色造成1点伤害'; break;
						}
						return '<li>当前韵律：' + (player.vl_pluvia_xs || '平') + '<br><li>' + str;
					},
    },
    group: "vl_pluvia_xs_zhuanyun",
    yunlvSkill: true,
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
					const target = event.target;
					switch (player.vl_pluvia_xs || '平') {
        						case '平':
        							target.recover()
        							break;
        						case '仄':
        							target.damage(1, player)
        							break;
        					}
    },
    ai: {
        order: 7,
        result: {
            target(player, target) {
							if (player.vl_pluvia_xs == '平') {
								if (target.hp == 1) return 5;
								if (player == target && player.countCards('h') > player.hp) return 5;
								return 2;
							} else {
								return get.damageEffect(target, player) - (target.maxHp - target.hp) / 2;
							}
						},
        },
    },
    subSkill: {
        zhuanyun: {
            trigger: {
                player: "vl_pluvia_sxAfter",
            },
            forced: true,
            locked: false,
            async content(event, trigger, player) {
							player.changeYun('vl_pluvia_xs');
						},
            sub: true,
        },
    },
    t: {
        name: "相生",
        info: `${get.poptip("yunlvji")}。出牌阶段限一次，<li>平：你可以弃置一张【闪】，令一名角色回复1点体力。<li>仄：你可以弃置一张【杀】，对一名其他角色造成1点伤害。<li>转韵：你发动〖视新〗结算完毕后。`,
    },
};
