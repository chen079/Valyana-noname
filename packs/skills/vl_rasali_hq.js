import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageSource",
    },
    filter(event, player) {
        return player != event.player && event.num < event.player.hp;
    },
    usable: 1,
    check(event, player) {
        if (get.attitude(player, event.player) > -2) return false;
        if (player.hp > 2) return true;
        if (player.hp == 2 && event.player.hp < 3) return false;
        return player.hp > 1;
    },
    logTarget: "player",
    async content(event, trigger, player) {
        player.loseHp();
        trigger.player.addTempSkill('vl_rasali_hq_recover');
        trigger.player.storage.vl_rasali_hq_recover = trigger.player.hp
        trigger.player.damage(trigger.player.hp, player)
    },
    subSkill: {
        recover: {
            trigger: {
                player: "damageEnd",
            },
            forced: true,
            popup: false,
            charlotte: true,
            filter(event, player) {
                return event.skill = 'vl_rasali_hq';
            },
            async content(event, trigger, player) {
                player.recover(trigger.player.storage.vl_rasali_hq_recover);
                trigger.player.storage.vl_rasali_hq_recover = 0
            },
        },
    },
    t: {
        name: "魂牵",
        info: "每回合限一次，当你对其他角色造成伤害后，你可失去1点体力，然后对该角色造成X点伤害。此伤害结算结束后，其回复X点体力（X为其体力值）。",
    },
};
