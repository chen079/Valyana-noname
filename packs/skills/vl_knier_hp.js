import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    frequent: true,
    filter(eveny, player) {
        return player.getExpansions('vl_knier_wh').length > 0
    },
    async content(event, trigger, player) {
        const result = await player.chooseCardButton('选择一张牌', 1, player.getExpansions('vl_knier_wh')).set('prompt2', "是否将一张“雾花”当作【出其不意】使用").set("ai", function (button) {
            return 9 - get.value(button.link);
        }).forResult();
        if (result.bool) {
            const card = result.links;
            const next = player.chooseUseTarget('将一张“雾花”当作【出其不意】使用', card, { name: 'chuqibuyi' }, false);
            next.viewAs = true;
            await next;
        }
    },
    t: {
        name: "海平",
        info: "准备阶段，你可以将你的一张“雾花”当作【出其不意】使用。",
        taici: ["雾花落海，照样能起浪。", "轮到我把它放回场里了。"],
    },
};
