import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    filterTarget(card, player, target) {
        return target != player && target.countCards('h') > 0 && !player.storage.vl_sangdi_at.includes(target);
    },
    filter: (event, player) => !player.hasSkill('vl_sangdi_at_blocker'),
    init(player) {
        if (!player.storage.vl_sangdi_at) player.storage.vl_sangdi_at = []
    },
    intro: {
        content: "本回合已对$发动过技能",
    },
    async content(event, trigger, player) {
        const target = event.target;
        player.storage.vl_sangdi_at.push(target)
        player.markSkill('vl_sangdi_at')
        const result = await player.chooseControl('没有【闪】', '有【闪】').set('ai', function (card) {
            const target = _status.event.getParent().target;
            if (target.countCards('h', 'shan') > 0 && Math.random() <= 0.55) return '有【闪】';
            if (target.countCards('h', 'shan') == 0 && Math.random() <= 0.45) return '有【闪】';
            return '没有【闪】';
        }).forResult();
        if (Math.random() <= 0.7) player.say('我似乎嗅到了线索的味道')
        if (result.control == '没有【闪】') {
            game.log(player, '选择了"没有【闪】"')
            if (target.countCards('h', 'shan')) {
                player.addTempSkill('vl_sangdi_at_blocker');
            } else {
                game.log(player, '猜对了')
                await player.gainPlayerCard(target, true, 'visible', 'h');
            }
            return;
        } else {
            game.log(player, '选择了"有【闪】"')
            if (target.countCards('h', 'shan')) {
                game.log(player, '猜对了')
                await player.gainPlayerCard(target, true, 'visible', 'h');
            } else {
                player.addTempSkill('vl_sangdi_at_blocker');
            }
        }
    },
    ai: {
        order: 8,
        result: {
            player(player, target) {
                return -get.attitude(player, target);
            },
        },
        threaten: 2,
    },
    group: "vl_sangdi_at_clear",
    subSkill: {
        clear: {
            trigger: {
                player: "phaseAfter",
            },
            charlotte: true,
            forced: true,
            content: () => {
                player.storage.vl_sangdi_at = []
                player.unmarkSkill('vl_sangdi_at')
            },
        },
        blocker: {
            mark: true,
            intro: {
                content: "本回合不能再发动【暗探】",
            },
        },
    },
    _priority: 0,
    t: {
        name: "暗探",
        info: "出牌阶段，你可以选择一名本回合未成为过此技能目标的角色，猜测其是否有【闪】。若你猜对，你观看其手牌并获得其中一张；否则本回合你不能再使用该技能。",
    },
};
