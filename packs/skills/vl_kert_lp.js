import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: "phaseJieshuBegin",
    },
    limited: true,
    frequent: false,
    unique: true,
    async content(event, trigger, player) {
        player.awakenSkill("vl_kert_lp");
        player.addTempSkill("vl_kert_ql", { player: "phaseEnd" });
        player.addTempSkill("vl_kert_dp", { player: "phaseEnd" });
    },
    mark: true,
    intro: {
        content: "limited",
    },
    skillAnimation: true,
    init(player, skill) {
        player.storage[skill] = false;
    },
    derivation: ["vl_kert_dp", "vl_kert_ql"],
    t: {
        name: "掳魄",
        info: `限定技，结束阶段，你可以获得技能${get.poptip("vl_kert_ql")}和${get.poptip("vl_kert_dp")}直到你的下个回合结束。 `,
    },
};
