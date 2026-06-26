import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageBegin2",
    },
    forced: true,
    filter(event, player) {
        let next = player.getNext();
        if (event.player == next && get.distance(player, next) <= 1) return true;
        return false;
    },
    async content(event, trigger, player) {
        trigger.num++
    },
    t: {
        name: "猎颈",
        info: "锁定技，当你对一名其他角色造成伤害时，若你与其距离为1且其位于你的下家，则你令此伤害+1。",
    },
};
