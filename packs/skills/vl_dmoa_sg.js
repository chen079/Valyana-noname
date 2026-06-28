import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseZhunbeiBegin",
    },
    filter: (event, player) => player.countCards('h') > 0 && player.getStorage('vl_dmoa_sg', '') !== '' && player.getStorage('vl_dmoa_sg', ''),
    direct: true,
    init: (player) => {
        player.setStorage('vl_dmoa_sg', '')
    },
    async content(event, trigger, player) {
        const choose = await player.chooseCard('h', get.prompt2("vl_dmoa_sg")).set('ai', function (card) {
            if (player.getStorage('vl_dmoa_sg', '') === '点数不大于其') return get.number(card);
            if (player.getStorage('vl_dmoa_sg', '') === '点数不小于其') return 14 - get.number(card);
            if (player.getStorage('vl_dmoa_sg', '') === '颜色与其不同') return Math.random();
            if (player.getStorage('vl_dmoa_sg', '') === '类型与其相同') return get.type(card) == 'basic' ? 4 : 5 * Math.random();
            return Math.random();
        }).forResult();
        if (!choose.bool) return;

        event.cards = [];
        event.card = choose.cards[0];
        player.showCards(choose.cards);
        while (player.getStorage('vl_dmoa_sg', '')) {
            const judge = await player.judge(function (result) {
                let evt = _status.event.getParent('vl_dmoa_sg');
                if (player.getStorage('vl_dmoa_sg', '') === '点数不大于其') {
                    if (evt && evt.card && get.number(evt.card) < get.number(result)) return 0;
                } else if (player.getStorage('vl_dmoa_sg', '') === '点数不小于其') {
                    if (evt && evt.card && get.number(evt.card) > get.number(result)) return 0;
                } else if (player.getStorage('vl_dmoa_sg', '') === '颜色与其不同') {
                    if (evt && evt.card && get.color(evt.card) == get.color(result)) return 0;
                } else if (player.getStorage('vl_dmoa_sg', '') === '类型与其相同') {
                    if (evt && evt.card && get.type2(evt.card) != get.type2(result)) return 0;
                }
                return 1;
            }).set('callback', function () {
                let evt = event.getParent(2);
                event.getParent().orderingCards.remove(event.judgeResult.card);
                evt.cards.push(event.judgeResult.card);
                evt.card = event.judgeResult.card;
            }).forResult();
            if (!judge.bool) break;
        }

        const cards = event.cards.filterInD();
        if (!cards.length) return;
        const result = await player.chooseTarget('将' + get.translation(cards) + '交给一名角色', true).set('ai', function (target) {
            let player = _status.event.player;
            let att = get.attitude(player, target) / Math.sqrt(1 + target.countCards('h'));
            if (target.hasSkillTag('nogain')) att /= 10;
            return att;
        }).forResult();
        if (!result.bool) return;
        let target = result.targets[0];
        event.target = target;
        player.line(target, 'green');
        await target.gain(cards, 'gain2').set('giver', player);
    },
    ai: {
        order: 9,
        result: {
            player: 1,
        },
    },
    _priority: 0,
    mark: true,
    intro: {
        markcount: () => undefined,
        content: "当前的笙歌条件为#",
    },
    group: "vl_dmoa_sg_choose",
    subSkill: {
        choose: {
            trigger: {
                player: ["phaseBegin", "phaseEnd"],
            },
            direct: true,
            async content(event, trigger, player) {
                const choiceList = ['点数不大于其', '点数不小于其', '颜色与其不同', '类型与其相同'];
                const choice = ['选项一', '选项二', '选项三', '选项四'];
                const result = await player.chooseControl(choice).set('choiceList', choiceList).set('prompt2', '请选择你的“笙歌”条件').set('ai', function () {
                    return choice.randomGet()
                }).forResult();
                if (!result.bool) return;
                game.log(player, '选择的', '#g【笙歌】', '条件为', '#b' + choiceList[result.index])
                player.setStorage('vl_dmoa_sg', choiceList[result.index])
            },
        },
    },
    t: {
        name: "笙歌",
        info: "回合开始或结束时，你选择一项（代替上一次的选择）。准备阶段，你可以展示一张手牌并重复进行判定，直到判定牌对此上一张展示或判定的牌不满足“笙歌”条件或缺少条件。然后令一名角色获得这些判定牌。条件：<li>1.点数不大于其；<li>2.点数不小于其；<li>3.颜色与其不同；<li>4.类型与其相同。",
        taici: ['圣歌未落，罪影先散。', '以光为刃，斩断迷惘。'],
    },
};
