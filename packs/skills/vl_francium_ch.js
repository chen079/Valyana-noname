import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseBegin",
    },
    init(player) {
        player.markSkill('hubian')
        game.broadcastAll(function (player) {
            player.$changeHubian();
        }, player);
    },
    forced: true,
    async content(event, trigger, player) {
        player.changeHubian()
        if (!player.storage.hubian) {
            player.changeAvatarImage(player.name, player.name)
        } else {
            player.changeAvatarImage(player.name, player.name + '2')
        }
    },
    group: "vl_francium_ch_def",
    subSkill: {
        def: {
            trigger: {
                player: "damageBegin3",
            },
            filter(event, player) {
                return event.source && event.source.countCards('h') > player.countCards('h')
            },
            forced: true,
            async content(event, trigger, player) {
                trigger.num -= 1
            },
            ai: {
                effect: {
                    target(card, player, target) {
                        if (get.tag(card, 'damage') && target.countCards('h') < player.countCards('h')) {
                            if (player.hasSkillTag('jueqing', false, target)) return;
                            return 0.1;
                        }
                    },
                },
            },
        },
    },
    t: {
        name: "晨昏",
        info: `锁定技，回合开始时，你改变你的${get.poptip("hubian")}状态；当你受到伤害时，若你的手牌数小于伤害来源，你令此伤害-1。`,
    },
};
