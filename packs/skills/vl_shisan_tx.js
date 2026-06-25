import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseEnd",
    },
    direct: true,
    filter(event, player) {
					return !player.getHistory('useCard').length;
				},
    async content(event, trigger, player) {
        const targetResult = await player
        	.chooseTarget(1, '###是否发动【推心】？###视为使用一张没有距离限制的【推心置腹】')
        	.set('filterTarget', function (card, player, target) {
        		return player.canUse('tuixinzhifu', target, false);
        	})
        	.forResult();
        if (!targetResult.bool) return;
        const target = targetResult.targets[0];
        await player.useCard({ name: 'tuixinzhifu' }, target);
        if (target.countCards('hes') == 0) return;
        const otherResult = await player
        	.chooseTarget(1, true, '选择【推心】的另一个目标')
        	.set('ai', function (currentTarget) {
        		const currentPlayer = _status.event.player;
        		if (target.countCards('h', 'sha') > 0) {
        			return get.effect(currentTarget, { name: 'sha' }, currentPlayer, currentPlayer);
        		}
        		return get.effect(currentTarget, { name: 'wuzhong' }, currentPlayer, currentPlayer);
        	})
        	.set('filterTarget', function (card, player, currentTarget) {
        		return target != currentTarget;
        	})
        	.forResult();
        if (!otherResult.bool) return;
        const target1 = otherResult.targets[0];
        const list = [];
        const choiceList = [];
        if (target.countCards('h') > 0) {
        	list.push('交牌');
        	choiceList.push('交给' + get.translation(target1) + '两张手牌（不足则全交）。');
        }
        if (target.countCards('hs', 'sha') > 0) {
        	list.push('出杀');
        	choiceList.push('对' + get.translation(target1) + '使用一张【杀】');
        }
        if (!list.length) return;
        const choiceResult = await target.chooseControl(list).set('choiceList', choiceList)
        	.set('ai', function () {
        		const currentPlayer = _status.event.player;
        		const currentTarget = _status.event.target;
        		if (list.length == 1) return '交牌';
        		const att = get.attitude(currentPlayer, currentTarget);
        		if (att < 0) return '出杀';
        		return '交牌';
        	}).set('target', target1).forResult();
        if (choiceResult.control == '交牌') {
        	const giveResult = await target.chooseCard(2, 'h', true).set('ai', function (card) {
        		return 100 - get.value(card);
        	}).forResult();
        	if (!giveResult.bool) return;
        	await target1.gain(target, giveResult.cards, 'giveAuto');
        	return;
        }
        const shaResult = await target.chooseCard(1, 'hs', true).set('filterCard', function (card) {
        	return get.name(card) == 'sha';
        }).set('ai', function (card) {
        	return 100 - get.value(card);
        }).forResult();
        if (!shaResult.bool) return;
        await target.useCard(target1, shaResult.cards, false);
    },
    t: {
        name: "推心",
        info: `你未使用过牌的回合结束时，你可以视为使用一张无距离限制的${get.poptip("tuixinzhifu")}。然后目标需要对你指定的另一名角色选择一项：<li>1.使用一张无距离限制的【杀】；<li>2.交给其两张手牌（不足则全交）。`,
    },
};
