import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    contentBefore: function () {
					const apiUrl = "https://api.linhun.vip/api/miyu";
					const apiKey = "16562ba900c4eb3189bbc09b0a50bc24";
					// 构造GET请求的URL，将apiKey作为查询参数传递
					const url = `${apiUrl}?apiKey=${apiKey}`;
					// 发送GET请求
					fetch(url)
						.then(response => response.json())
						.then(data => {
							// 在这里处理返回的JSON数据
							player.storage.vl_puzzles = data
						})
						.catch(error => {
							// 处理请求错误
							console.error("Error fetching data:", error);
						});
				},
    content: function () {
					'step 0'
					event.puzzle = player.storage.vl_puzzles
					player.chooseText(true).set('ai', function () {
						return event.puzzle.Answer.replace(/\([^)]*\)/g, '')
					}).set('prompt2', event.puzzle.name + '(' + event.puzzle.Tips + ')')
						.set('prompt', get.prompt('vl_puzzles'))
					'step 1'
					game.log(player, '回答了' + result.text)
					if (result.text == event.puzzle.Answer.replace(/\([^)]*\)/g, '')) {
						game.log(player, '回答正确')
						player.draw(3)
						player.chooseCardTarget({
							position: 'he',
							filterCard: true,
							forced: false,
							selectCard: 3,
							filterTarget: function (card, player, target) {
								return player != target;
							},
							ai1: function (card) {
								return 1;
							},
							ai2: function (target) {
								var att = get.attitude(_status.event.player, target);
								return att;
							},
							prompt: '请选择要送人的三张卡牌',
						});
					} else {
						game.log(player, '回答错误')
					}
					'step 2'
					if (result.bool) {
						var target = result.targets[0]
						player.give(result.cards, target)
					} else {
						player.chooseToDiscard('he', 3, true)
					}
				},
    ai: {
        order: 10,
        result: {
            player: 1,
        },
        threaten: 3.2,
    },
    t: {
        name: "猜谜",
        info: "出牌阶段限一次，你可以进行一次猜谜，若你成功，摸你张牌然后选择一项：1.将三张牌交给一名其他角色；2.弃置三张牌。",
    },
};
