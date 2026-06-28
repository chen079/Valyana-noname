import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    filter(event, player) {
        return event.getParent().name == 'sha' && player.getExpansions('vl_xieji').length > 0
    },
    check(event, player) {
        if (get.attitude(player, event.player) >= 0) return false;
        if (event.player.hasSkillTag('filterDamage', null, {
            player: player,
            card: event.card,
        })) return false;
        return true;
        //return player.hasMark('xinfu_falu_spade')||get.color(ui.cardPile.firstChild)=='black';
    },
    usable: 1,
    prompt: "你可以弃置X张'协'令此伤害+X",
    logTarget: "player",
    async content(event, trigger, player) {
        const result = await player.chooseCardButton('选择弃置X张“协”', [1, Infinity], player.getExpansions('vl_xieji')).forResult();
        if (result.bool) {
            trigger.num += result.links.length
            await player.loseToDiscardpile(result.links)
        } else {
            return;
        }
    },
    t: {
        name: "烈断",
        info: "每回合限一次，当你因执行【杀】的效果对一名角色造成伤害时，你可以移去X张“协”，令此伤害+X。结束阶段，你获得武将牌上的所有“协”。",
        taici: ["烈意既起，便要断得彻底。", "这一击，替前面的铺垫收尾。"],
    },
};
