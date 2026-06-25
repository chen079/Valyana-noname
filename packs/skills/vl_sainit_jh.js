import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    direct: true,
    mark: true,
    intro: {
        content: "你选择的目标为:$",
    },
    filter: function filter(event,player){
					game.hasPlayer(c=>c!=player);
				},
    content: function () {
					'step 0'
					player.chooseTarget(get.prompt2('vl_sainit_jh'), function (card, player, target) {
						return target != player
					}, true).set('ai', function (target) {
						return Math.random()
					})
					'step 1'
					if (result.bool) {
						game.hasPlayer(function (current) {
							if (current != player && current.hasSkill('vl_sainit_jh_draw')) {
								current.removeSkill('vl_sainit_jh_draw')
							}
						})
						var target = result.targets[0]
						target.storage.vl_sainit_jh = player
						game.hasPlayer(function (current) {
							if (current.hasSkill('vl_sainit_jh_draw')) current.removeSkill('vl_sainit_jh_draw')
						})
						target.addSkill('vl_sainit_jh_draw')
						player.storage.vl_sainit_jh = target
					}
				},
    group: "vl_sainit_jh_discard",
    subSkill: {
        discard: {
            trigger: {
                player: ["gainAfter"],
                global: ["loseAsyncAfter"],
            },
            init: function (player) {
							if (!player.storage.vl_sainit_jh_count) player.storage.vl_sainit_jh_count = 0;
						},
            filter: function (event, player) {
							if(!event.getg?.(player)?.length) return;
							return player.countCards('h') && player.countCards('h') > player.maxHp && !player.storage.vl_sainit_yq
						},
            direct: true,
            content: function content() {
							player.chooseToDiscard(player.countCards('h') - player.maxHp, true);		
						},
        },
        draw: {
            trigger: {
                player: "loseAfter",
                global: ["loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter"],
            },
            filter: function filter(event, player) {
							return event.getl(player)?.cards2?.length;
						},
            onremove: function (player) {
							player.storage.vl_sainit_jh = ''
						},
            direct: true,
            charlotte: true,
            forced: true,
            content: function () {
							player.storage.vl_sainit_jh.draw(trigger.cards.length);
						},
        },
    },
    t: {
        name: "镜华",
        info: "①回合开始时，你选择一名其他角色，直到你下次发动该技能，当该角色失去牌后，你摸等于此次失去牌数的牌；②当你的手牌数大于X时，你将手牌数弃至X（X为你体力上限）。",
    },
};
