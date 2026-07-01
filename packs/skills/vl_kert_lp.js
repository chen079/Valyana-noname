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
        player.addSkill("vl_kert_ql");
        player.addSkill("vl_kert_dp");
        const currentPhase = trigger.getParent('phase');
        player.when('phaseAfter')
            .filter(event => event != currentPhase)
            .then(() => {
                player.removeSkill("vl_kert_ql");
                player.removeSkill("vl_kert_dp");
            })
            .vars({ currentPhase });
    },
    mark: true,
    intro: {
        content: "limited",
    },
    skillAnimation: true,
    init(player, skill) {
        player.setStorage(skill, false);
    },
    derivation: ["vl_kert_dp", "vl_kert_ql"],
    t: {
        name: "掳魄",
        info: `限定技，结束阶段，你可以获得技能${get.poptip("vl_kert_ql")}和${get.poptip("vl_kert_dp")}直到你的下个回合结束。 `,
    },
};
