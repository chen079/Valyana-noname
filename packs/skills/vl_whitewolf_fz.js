import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    filter: function (event, player) {
					return event.player != player && event.num > 0 && !event.player.hasSkill('vl_whitewolf_fz_1')
				},
    check: function (event, player) {
					var att = get.attitude(player, event.player)
					if (att > 0) {
						if (event.player.hp == 1) {
							return true
						} else {
							return false
						}
					} else {
						if (event.player.countCards('h') < 4) {
							return false
						} else {
							return true
						}
					}
				},
    content: function (event, player) {
					trigger.player.addTempSkill('vl_whitewolf_fz_1', { player: "phaseBegin" })
					trigger.player.storage.vl_whitewolf_fz = [player]
					if (!player.storage.vl_whitewolf_fz) player.storage.vl_whitewolf_fz = []
					player.storage.vl_whitewolf_fz.push(trigger.player)
					trigger.player.addTempSkill('vl_whitewolf_fz_disable')
					player.addTempSkill('vl_whitewolf_fz_disable')
				},
    subSkill: {
        "1": {
            mark: true,
            intro: {
                content: "你的红色手牌均视为【闪】，黑色手牌均视为【无懈可击】，直到其下个回合开始。",
            },
            mod: {
                cardname: function (card, player) {
								if (get.color(card) == 'red') return 'shan';
								if (get.color(card) == 'black') return 'wuxie'
							},
            },
        },
        disable: {
            onremove: function (player) {
							delete player.storage.vl_whitewolf_fz
						},
            mark: true,
            intro: {
                mark: function (dialog, storage, player) {
								dialog.addText('你本回合只能对' + get.translation(player.storage.vl_whitewolf_fz) + '使用牌')
							},
            },
            mod: {
                playerEnabled: function (card, player, target, now) {
								if (!player.storage.vl_whitewolf_fz.includes(target)) return false;
							},
            },
        },
    },
    t: {
        name: "峰峙",
        info: "当你对其他角色造成伤害时，你可以令其所有红色手牌均视为【闪】，黑色手牌均视为【无懈可击】直到其下个回合开始，若如此做，本回合你/其使用牌仅能指定其/你为目标。",
    },
};
