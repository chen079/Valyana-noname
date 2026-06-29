import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
        if (player.hasSkill('_qianghua_effect')) return false;
        if (!lib.skill._qianghua.hasQianghuaSkill(player)) return false;
        return player.hp > 0 || player.countCards('he') >= 2;
    },
    async content(event, trigger, player) {
        const choices = [];
        const choiceList = [];
        if (player.hp > 0) {
            choices.push('失去体力');
            choiceList.push('失去1点体力');
        }
        if (player.countCards('he') >= 2) {
            choices.push('弃置牌');
            choiceList.push('弃置两张牌');
        }
        const result = choices.length == 1 ? { control: choices[0] } : await player.chooseControl(choices).set('choiceList', choiceList).set('prompt', '选择进入强化状态的代价').set('ai', function () {
            const player = _status.event.player;
            if (player.hp > 2 && choices.includes('失去体力')) return '失去体力';
            return choices.includes('弃置牌') ? '弃置牌' : '失去体力';
        }).forResult();
        if (result.control == '弃置牌') {
            await player.chooseToDiscard(2, 'he', true);
        } else {
            await player.loseHp();
        }
        await player.qianghua();
    },
    ai: {
        order: 8,
        result: {
            player(player) {
                if (player.hasSkill('_qianghua_effect')) return 0;
                return player.hp > 2 || player.countCards('he') >= 2 ? 1 : 0;
            },
        },
    },
    hasQianghuaSkill(player) {
        return player.getSkills(null, false, false).some(skill => lib.skill[skill]?.qianghua);
    },
    subSkill: {
        effect: {
            charlotte: true,
            mark: true,
            intro: {
                content: "你处于强化状态，下一个结算的强化技会额外执行强化效果。",
            },
        },
    },
    t: {
        name: "强化",
        info: "出牌阶段限一次，若你拥有强化技且未处于强化状态，你可以失去1点体力或弃置两张牌，进入强化状态。",
    },
};
