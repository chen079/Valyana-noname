import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    sunbenSkill: true,
    filterTarget: function (card, player, target) {
					if(target==player && !player.countDiscardableCards(player,"he")) return;
					return target.countCards('h') == player.countCards('h');
				},
    content: async function content(event,trigger,player){
					player.removeSkill("vl_bwol_mb_recover");
					player.awakenSkill(event.name);
					player.addSkill("vl_bwol_mb_recover");
					const target=event.target;
					const result=await player.discardPlayerCard(1, target, 'he',true)
						.set("ai",card=>{
							if(player!=target) return 1;
							return get.value(card);
						})
						.forResult();
					if (result.bool) {
						var num = target.countCards('h');
						if (num <= 3) {
							await target.damage(1, 'fire', player);
						} else {
							if (!target.hasVuff('lieshi')) {
								await target.addVuff('lieshi');
								target.addTempSkill('vl_bwol_mb_1', { player: 'phaseAfter' });
							} else {
								await player.discardPlayerCard(2, target, 'he',true);
							}
						}
					}
					return;
				},
    ai: {
        expose: 0.3,
        result: {
            target: function (player, target) {
							if (target.countCards('h') <= 3) {
								return get.damageEffect(target, player, target, 'fire') + get.effect(target, { name: 'guohe_copy2' }, player, player);;
							} else {
								return 3 * get.effect(target, { name: 'guohe_copy2' }, player, player);
							}
						},
        },
        order: 14,
    },
    subSkill: {
        "1": {
            mod: {
                vuffIgnore: function (player, buff, type) {
								if (buff == 'lieshi' && type == 'reduceVuff') return true
							},
            },
        },
        recover: {
            charlotte: true,
            trigger: {
                player: "drawEnd",
            },
            intro: {
                content: "需要摸牌后才能发动",
            },
            mark: true,
            forced: true,
            popup: false,
            firstDo: true,
            content: function content() {
							player.removeSkill('vl_bwol_mb_recover');
							player.popup('魔爆');
							player.restoreSkill("vl_bwol_mb");
							game.log(player, '恢复了技能', '#g【魔爆】');
						},
        },
    },
    t: {
        name: "魔爆",
        info: "昂扬技，出牌阶段，你可以弃置一名手牌数与你相同的角色一张牌，然后若其手牌数：<li>不大于3：你对其造成1点火焰伤害。<li>大于3：令其进入“「「劣势*」」直到其回合结束，若其有同名buff，改为你弃置其两张牌；</li>*激昂：你摸牌后。",
    },
};
