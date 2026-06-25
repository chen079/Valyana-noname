import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    preHidden: true,
    trigger: {
        global: "damageEnd",
    },
    checkx(event, player) {
					var att1 = get.attitude(player, event.player);
					var att2 = get.attitude(player, event.source);
					return att1 > 0 && att2 <= 0;
				},
    filter(event, player) {
					return (event.source && !event.player.isDead() && player.countCards('he') && event.source !== player);
				},
    direct: true,
    content: async function content(event,trigger,player) {
					const next = player.chooseToDiscard('he', get.prompt2('vl_kref_yz', trigger.player));
					const check = lib.skill.vl_kref_yz.checkx(trigger, player);
					next.set('ai', function (card) {
						if (_status.event.goon) return 8 - get.value(card);
						return 0;
					});
					next.set('logSkill', 'vl_kref_yz');
					next.set('goon', check);
					next.setHiddenSkill('vl_kref_yz');
					let result = await next.forResult();
					if (!result.bool) return;
					result = await player.judge().forResult();
					switch (result.color) {
						case 'black': {
							await trigger.player.gainPlayerCard(trigger.num, true, trigger.source, 'he');
							await trigger.player.gain(trigger.cards, 'gain2');
							await trigger.player.draw(trigger.num);
							break;
						}
						case 'red': {
							await trigger.player.recover();
							await trigger.player.link(false);
							await trigger.player.turnOver(false);
							await trigger.source.turnOver();
							break;
						}
					}
				},
    ai: {
        maixie: true,
        maixie_hp: true,
        effect: {
            target(card, player, target) {
							if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
							if (get.tag(card, 'damage')) return [1, 0.55];
						},
        },
    },
    t: {
        name: "月临",
        info: "一名角色受到来源不为你的伤害后，你可以弃置一张牌并进行一次判定。若结果为黑色，该角色依次执行以下效果，①获得伤害来源的X张牌，②获得造成伤害的牌，③摸X张牌（X为此次伤害值）；若结果为红色，该角色依次执行以下效果，①回复1点体力，②复原武将牌，③伤害来源翻面。",
    },
};
