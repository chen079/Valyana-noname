import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    usable: 1,
    mostColor(player) {
        if (player.countCards('h', { color: 'red' }) > player.countCards('h', { color: 'black' })) {
            return ['red']
        }
        if (player.countCards('h', { color: 'red' }) < player.countCards('h', { color: 'black' })) {
            return ['black']
        }
        if (player.countCards('h', { color: 'red' }) == player.countCards('h', { color: 'black' })) {
            return ['red', 'black']
        }
    },
    filterCard(card, player) {
        const colors = lib.skill.vl_baixi_bm.mostColor(player)
        return colors.includes(get.color(card))
    },
    selectCard: 1,
    filterTarget(card, player, target) {
        return player != target
    },
    selectTarget: 1,
    async content(event, trigger, player) {
        const target = event.target;
        target.addTempSkill('vl_baixi_bm_1')
        target.addTempSkill('vl_baixi_bm_2', { player: 'phaseEnd' })
        target.setStorage('vl_baixi_bm_2', player)
    },
    subSkill: {
        "1": {
            mark: true,
            intro: {
                content: "本回合不能使用或打出牌",
            },
            mod: {
                cardEnabled() {
                    return false;
                },
                cardRespondable() {
                    return false;
                },
                cardSavable() {
                    return false;
                },
            },
        },
        "2": {
            trigger: {
                player: "phaseDrawBegin2",
            },
            init(player) {
                player.markSkill('vl_baixi_bm_2')
            },
            onremove(player) {
                player.unmarkSkill('vl_baixi_bm_2')
            },
            intro: {
                content: "摸牌阶段，你放弃摸牌，改为与$将手牌摸至4张",
            },
            forced: true,
            charlotte: true,
            async content(event, trigger, player) {
                trigger.cancel()
                await player.drawTo(4)
                const target = player.getStorage('vl_baixi_bm_2', null);
                if (target && target.isIn()) await target.drawTo(4)
            },
        },
    },
    ai: {
        order: 7,
        result: {
            target(player, target) {
                if (target.countCards('h') < 4) return 0.4 * (4 - target.countCards('h'))
                if (target.countCards('h') >= 4) return -2
            },
        },
    },
    t: {
        name: "白墨",
        info: "出牌阶段限一次，你可以弃置一张颜色最多的手牌，然后选择一名其他角色，令其本回合无法使用或打出牌，其下一个摸牌阶段开始时，其放弃摸牌，然后你与其将手牌摸至4。",
    },
};
