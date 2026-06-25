import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        source: "damageAfter",
    },
    usable: 5,
    forced: true,
    async content(event, trigger, player) {
        var targets = game.filterPlayer(current => current.hasSkill('vl_liona_zz')).sortBySeat();
        player.line(targets, 'green');
        game.asyncDraw(targets);
    },
    t: {
        name: "整战",
        info: `锁定技，每回合限五次，当拥有${get.poptip("vl_liona_zz")}的角色造成伤害后，所有拥有${get.poptip("vl_liona_zz")}的角色同时摸一张牌。`,
    },
};
