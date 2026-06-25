import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    integrate(a, b) {
					let f = '';
					const x1 = Math.floor(20 * Math.random() - 10);
					const x2 = Math.floor(20 * Math.random() - 10);
					const x3 = Math.floor(20 * Math.random() - 10);
					f = ((x1 == 1 ? '' : x1) == -1 ? '-' : x1) + 'x² ' + (x2 < 0 ? "" : "+") + ((x2 == 1 ? '' : x2) == -1 ? '-' : x2) + 'x ' + (x3 < 0 ? "" : "+") + ((x3 == 1 ? '' : x3) == -1 ? '-' : x3)
					const A = ((x1 / 3) * Math.pow(b, 3) + (x2 / 2) * Math.pow(b, 2) + (x3 * b)) - ((x1 / 3) * Math.pow(a, 3) + (x2 / 2) * Math.pow(a, 2) + (x3 * a));
					const error1 = (A + ((Math.floor(Math.random() * 11) - 5) / 10) * A + 1).toFixed(3);
					const error2 = (A + ((Math.floor(Math.random() * 21) - 10) / 100) * A + 2).toFixed(3);
					const error3 = (A + ((Math.floor(Math.random() * 51) - 25) / 100) * A + 3).toFixed(3);
					return {
						f: f,
						results: [A, error1, error2, error3],
					};
				},
    async content(event, trigger, player) {
        const cards = get.cards(2);
        player.showCards(cards);
        player.discard(cards);
        const num1 = get.number(cards[0]);
        const num2 = get.number(cards[1]);
        const cardnum = [num1, num2].sort((a, b) => a - b);
        const integral = lib.skill.vl_sheep_jf.integrate(cardnum[0], cardnum[1]);
        if (event.isMine()) {
        	const choices = integral.results.slice().sort(() => Math.random() - 0.5);
        	const answerResult = await player.chooseControl()
        		.set('choiceList', choices)
        		.set('ai', function () {
        			return integral.results[0];
        		})
        		.set('prompt', '函数' + integral.f + '在[' + cardnum[0] + ',' + cardnum[1] + ']上的积分结果为')
        		.forResult();
        	if (choices[answerResult.index] !== integral.results[0]) {
        		game.log(player, '计算错误');
        		return;
        	}
        } else {
        	game.log(player, '计算正确');
        }
        game.log(player, '计算正确');
        const rewardCards = get.cards(5);
        player.showCards(rewardCards);
        player.gain(rewardCards, 'gain2');
        const choiceResult = await player.chooseControl().set('choiceList', [
        	'将五张牌交给一名其他角色',
        	'弃置五张牌',
        ]).set('ai', function () {
        	if (game.hasPlayer(function (current) {
        		return current != player && get.attitude(player, current) > 2;
        	})) return 0;
        	return 1;
        }).forResult();
        if (choiceResult.index == 0) {
        	const giveResult = await player.chooseCardTarget({
        		position: 'he',
        		filterCard: true,
        		selectCard: 5,
        		filterTarget: function (card, player, target) {
        			return player != target;
        		},
        		ai1: function (card) {
        			return 1;
        		},
        		ai2: function (target) {
        			const att = get.attitude(_status.event.player, target);
        			return att;
        		},
        		prompt: '请选择要送人的卡牌',
        		forced: true,
        	}).forResult();
        	if (giveResult.bool) {
        		const target = giveResult.targets[0];
        		await player.give(giveResult.cards, target);
        	}
        } else {
        	await player.chooseToDiscard(5, true, 'he');
        }
    },
    ai: {
        order: 7.5,
        result: {
            player: 1,
        },
    },
    t: {
        name: "机算",
        info: "出牌阶段限一次，你可以展示牌堆顶两张牌并弃置之，然后计算一个随机幂函数（最高二次幂）的积分（积分上限为其中较大的牌，下限为其中较小的牌），若你计算正确：你获得牌堆顶的五张牌，然后，你选择一项：1.交给一名其他角色五张牌；2.弃置五张牌。",
    },
};
