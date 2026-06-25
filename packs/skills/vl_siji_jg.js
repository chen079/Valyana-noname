import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    check(event, player) {
					return player.countCards('h', card => get.type(card) == 'basic') <= 1
				},
    async content(event, trigger, player) {
await player.showHandcards()
await player.discard(player.getCards('h', card => get.type(card) == 'basic'))
const result = await player.chooseButton(['降谷：是否视为使用其中一种牌？', [['wugu', 'taoyuan'], 'vcard']]).set('filterButton', function (button) {
        						return _status.event.player.hasUseTarget({ name: button.link[2], isCard: true });
        					}).set('ai', function (button) {
        						return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
        					}).set('forced', true).forResult();
if (result.bool) {
        						player.when("useCard2")
        							.filter((event, player) => event.card.name == 'wugu' || event.card.name == 'taoyuan' && event.targets.length > 0)
        							.then(() => {
        								player.chooseTarget([1, trigger.targets.length - 1], get.prompt('vl_siji_jg'), '为' + get.translation(trigger.card) + '减少任意个目标', function (card, player, target) {
        									return _status.event.targets.includes(target)
        								}).set('targets', trigger.targets).set('ai', function (target) {
        									var player = _status.event.player;
        									return -get.effect(target, _status.event.getTrigger().card, player, player)
        								});
        							})
        							.then(() => {
        								if (result.bool) {
        									player.logSkill('vl_siji_jg', result.targets);
        									trigger.targets.removeArray(result.targets);
        								}
        							})
        							.assign({
        								line: false,
        								direct: true,
        							})
        						await player.chooseUseTarget({ name: result.links[0][2], isCard: true }, true);
        					}
    },
    ai: {
        order: 4,
        result: {
            player: 1,
        },
    },
    t: {
        name: "降谷",
        info: "出牌阶段限一次，你可以展示你的所有手牌，并弃置其中的基本牌，然后你选择视为使用【五谷丰登】或【桃园结义】，且可为此牌减少任意名目标，目标数至少为1。",
    },
};
