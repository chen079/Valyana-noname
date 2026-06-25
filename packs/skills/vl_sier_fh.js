import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "dying",
    },
    forced: true,
    forceDie: true,
    unique: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "metal",
    async content(event, trigger, player) {
        player.awakenSkill('vl_sier_fh');
        player.removeSkill('vl_sier_xl')
        player.addSkill('vl_sier_xlg')
        await player.gainMaxHp()
        await player.recover(3)
        {
            const card = get.cardPile(function (card) {
                return get.suit(card) == 'heart';
            })
            if (card) await player.gain(card);
        }
        {
            const card = get.cardPile(function (card) {
                return get.suit(card) == 'club';
            })
            if (card) await player.gain(card);
        }
        {
            const card = get.cardPile(function (card) {
                return get.suit(card) == 'spade';
            })
            if (card) await player.gain(card);
        }
        {
            const card = get.cardPile(function (card) {
                return get.suit(card) == 'diamond';
            })
            if (card) await player.gain(card);
        }
    },
    derivation: "vl_sier_xlg",
    t: {
        name: "伏虎",
        info: "觉醒技，当你进入濒死状态时，你回复3点体力并摸四种花色的牌各一张，然后修改〖降龙〗。",
    },
};
