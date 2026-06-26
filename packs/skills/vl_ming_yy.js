import { lib, game, ui, get, ai, _status } from '../../../../noname.js';
import poems from '../jsons/poems.json'

export default {
    trigger: {
        player: "useCardToPlayered",
    },
    mark: true,
    intro: {
        markcount: () => undefined,
        mark(dialog, storage, player) {
            dialog.addText('已经使用过的诗')
            dialog.addText(player.storage.vl_ming_yy[1].join('、'))
        },
    },
    usable: 2,
    direct: true,
    filter(event, player) {
        return event.card.name == 'sha';
    },
    init(player) {
        if (!player.storage.vl_ming_yy) {
            player.storage.vl_ming_yy = [{}, []]
        }
        player.storage.vl_ming_yy[0] = poems
    },
    async content(event, trigger, player) {
        const textResult = await player.chooseText().set('prompt', get.prompt2('vl_ming_yy')).set('ai', function () {
            let title = Object.keys(player.storage.vl_ming_yy[0]);
            title = title.randomGet();
            return player.storage.vl_ming_yy[0][title]["poem"].randomGet();
        }).forResult();
        if (!textResult.bool) return;

        let matched = false;
        let title;
        let author;
        for (let i in player.storage.vl_ming_yy[0]) {
            if (!player.storage.vl_ming_yy[1].includes(i) && player.storage.vl_ming_yy[0][i]['poem'].includes(textResult.text)) {
                player.storage.vl_ming_yy[1].push(i);
                matched = true;
                title = i;
                author = player.storage.vl_ming_yy[0][i]['author'];
                player.say(i + '\n' + author);
                break;
            }
        }

        if (!matched) {
            game.log('你背诵的不是唐诗三百首中的诗或背诵错误！（记得检查标点符号是否打全）');
            return;
        }

        game.log(player, '背诵了', '#g' + author, '写的', '#g《' + title + '》', '中的一句');
        const choices = ['你摸两张牌', '令此【杀】对' + get.translation(trigger.target) + '的伤害+1'];
        const control = ['摸牌', '加伤'];
        if (trigger.target.countCards('h') != 0) {
            choices.push('弃置' + get.translation(trigger.target) + '两张牌');
            control.push('弃牌');
        }
        if (trigger.target.countCards('hej') != 0) {
            choices.push('获得' + get.translation(trigger.target) + '区域内的一张牌');
            control.push('拿牌');
        }
        const result = await player.chooseControl(control, 'cancel2').set('choiceList', choices).set('ai', function () {
            let player = _status.event.player;
            if (get.attitude(player, trigger.target) > 0) {
                return 'cancel2';
            } else {
                return control.randomGet();
            }
        }).forResult();
        if (result.control == '摸牌') {
            await player.draw(2);
        } else if (result.control == '加伤') {
            let id = trigger.target.playerid;
            let map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].extraDamage != 'number') {
                map[id].extraDamage = 0;
            }
            map[id].extraDamage++;
        } else if (result.control == '弃牌') {
            await player.discardPlayerCard(trigger.target, 'he', 2, true);
        } else if (result.control == '拿牌') {
            await player.gainPlayerCard(trigger.target, 'hej', 1, true);
        }
    },
    t: {
        name: "吟咏",
        info: "每回合限两次，当你使用【杀】指定目标后，你可以背诵唐诗三百首中的任意一首诗的任意一句（诗名不可重复），如若此做，你可以选择一项：<li>1.摸两张牌，<li>2.弃置目标角色两张牌，<li>3.获得目标角色一张牌，<li>4.令此【杀】对目标角色的伤害+1。",
    },
};
