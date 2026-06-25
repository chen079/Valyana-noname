import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "useCard",
    },
    shaRelated: true,
    direct: true,
    filter(event, player) {
					if(event.card.name != "sha")return;
					return player.hujia > 0;
				},
    content: async function content(event, trigger, player) {
					var choiceList = ['失去1点护甲，令此【杀】伤害基数+1', '失去1点护甲，令此【杀】不可被响应']
					var choice = ['加伤', '强命']
					if (player.hujia >= 2) {
						choiceList.push('背水：失去1点护甲并翻面')
						choice.push('背水！')
					}
					const result = await player.chooseControl('cancel2', choice).set('choiceList', choiceList)
						.set('ai', function () {
							var player = _status.event.player
							var target = _status.event.target
							if (get.mode == 'identity' && player.identity == target.identity) return 'cancel2'
							if (player.hujia > 2) {
								return '背水！'
							} else {
								return ['强命', '加伤'].randomGet()
							}
						}).set('target', trigger.target)
						.forResult();
					if(!result.bool)return;
					player.logSkill("vl_mountainbear_xj");
					await player.changeHujia(-1)
					if (['加伤','背水！'].includes(result.control)) {
						trigger.baseDamage++
					}
					if (['强命','背水！'].includes(result.control)) {
						trigger.directHit.addArray(game.players);
					}
					if (result.control == '背水！') {
						await player.changeHujia(-1);
						await player.turnOver();
					}
				},
    t: {
        name: "熊击",
        info: "当你使用【杀】时，你可以失去1点护甲并选择一项：<li>令此【杀】伤害基数+1，<li>令此【杀】不可被响应，<li>背水：再失去1点护甲并翻面。",
    },
};
