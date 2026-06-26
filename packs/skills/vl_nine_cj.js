import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    filter(event, player) {
        return player.countCards('he') > 0
    },
    async content(event, trigger, player) {
        if (!game.hasPlayer(c => c.countDiscardableCards(player, "he") && c != player)) return;
        const discardResult = await player.chooseToDiscard([1, Infinity], 'he', get.prompt2('vl_nine_cj')).set('ai', function (card) {
            return 7 - get.value(card)
        }).set('filterCard', function (card) {
            let type = get.type2(card);
            for (let i = 0; i < ui.selected.cards.length; i++) {
                if (get.type2(ui.selected.cards[i]) != type) return false;
            }
            return true;
        }).set('complexCard', true).forResult();
        if (!discardResult.bool) return;
        event.num = discardResult.cards.length;
        const targetResult = await player.chooseTarget('令一名角色弃置' + get.cnNumber(event.num) + '张牌', function (card, player, target) {
            return target.countCards('he') > 0 && target != player;
        }, true).set('ai', function (target) {
            return -get.attitude(_status.event.player, target) * (target.countCards('e') + 1);
        }).forResult();
        if (!targetResult.bool) return;
        event.target = targetResult.targets[0];
        player.discardPlayerCard(event.num, event.target, true);
        if (!player.getCards('e').length) return;
        const recastResult = await player.chooseBool('是否重铸装备区所有牌，对' + get.translation(event.target) + '使用任意张【杀】或令护甲加到1。').forResult();
        if (!recastResult.bool) return;
        const equips = player.getCards('e');
        player.recast(equips);
        const choice = ['护甲'];
        const choicelist = ['令护甲加到1。'];
        if (player.countCards('hs', 'sha') > 0) {
            choice.push('出杀');
            choicelist.push('对' + get.translation(event.target) + '使用任意张【杀】');
        }
        const controlResult = await player.chooseControl(choice).set('ai', function () {
            let player = _status.event.player;
            if (get.attitude(player, event.target) > 0) {
                return '护甲';
            }
            if (player.countCards('hs', 'sha') > 0) {
                return '出杀';
            }
            return '护甲';
        }).set('choiceList', choicelist).forResult();
        if (controlResult.control == '护甲') {
            if (player.hujia < 1) {
                player.changeHujia(1, null, true);
            }
            return;
        }
        while (player.countCards('hs', 'sha') > 0) {
            const useResult = await player.chooseToUse('hs', event.target, function (card, player, event) {
                return get.name(card) == 'sha'
            }, '冲击：是否对' + get.translation(event.target) + '使用一张杀？').forResult();
            if (!useResult.bool) break;
        }
    },
    t: {
        name: "冲击",
        info: "每回合结束时，你可以弃置任意张同类型的牌，并弃置另一角色的等量牌，然后可以重铸装备区所有牌，若如此做，你对其使用任意张【杀】或令护甲加到1。",
    },
};
