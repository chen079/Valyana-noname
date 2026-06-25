import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "damageBegin2",
    },
    forced: true,
    firstDo: true,
    popup: false,
    filter(event, player, storage) {
        if (!event.player.hasSkill('vl_terz_ly') || !event.player.hasSkill('vl_terz_ly')) return false
        if (!event.source || (event.source == event.player)) return false
        return !(event.player.storage.vl_terz_ly == event.source.storage.vl_terz_ly)
    },
    async content(event, trigger, player) {
        if (trigger.player.storage.vl_terz_ly == false && trigger.source.storage.vl_terz_ly == true) {
            trigger.source.gainPlayerCard(1, 'he', trigger.player, true)
            player.draw()
        } else if (trigger.player.storage.vl_terz_ly == true && trigger.source.storage.vl_terz_ly == false) {
            trigger.player.gainPlayerCard(1, 'he', trigger.source, true)
            player.draw()
        }
    },
    t: {
        name: "拓势",
        info: "锁定技，一名角色造成伤害时，若二者都拥有技能〖流域〗且状态不同，处于〖流域〗阴状态的角色获得阳状态角色的一张牌，然后你摸一张牌。",
    },
};
