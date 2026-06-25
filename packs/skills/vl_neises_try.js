import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    async content(event, trigger, player) {
let result;
if (!lib.config.chagpt) {
        						result = await player.chooseText().set('prompt', '请输入chatGPT的API密钥').set('ai', function () {
        						}).forResult()
        						game.saveConfig('chagpt', result.text)
        					} else {
        						result = await player.chooseBool('是否重新输入chatGPT的API密钥').forResult()
        						if (result.bool) {
        							result = await player.chooseText().set('prompt', '请输入chatGPT的API密钥').set('ai', function () {
        							}).forResult()
        							game.saveConfig('chagpt', result.text)
        						}
        					}
result = await player.chooseText().set('prompt', get.prompt2('vl_neises_try')).set('ai', function () {
        					}).forResult()
game.log(player, '询问chatGPT：', '#g' + result.text)
        					game.pause()
        					const url = "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions";
        					const prompt = result.text;
        					const temperature = 0.7;
        					const maxTokens = 100;
        					const requestOptions = {
        						method: "POST",
        						headers: {
        							"Content-Type": "application/json",
        							Authorization: "Bearer " + lib.config.chagpt,
        						},
        						body: JSON.stringify({
        							prompt: prompt,
        							temperature: temperature,
        							max_tokens: maxTokens,
        						}),
        					};
        					fetch(url, requestOptions)
        						.then(response => response.json())
        						.then((data) => {
        							game.log('chatGPT回复：' + data[0].choices.message.content)
        							game.resume()
        						})
        						.catch((error) => {
        							console.log(error)
        							game.log('错误信息：' + error.message)
        							game.resume()
        						});
    },
    t: {
        name: "AI",
        info: "出牌阶段，你可以与chatGPT对话。",
    },
};
