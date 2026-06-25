import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init(player) {
        if (!player.storage.vl_dolina_qj) player.storage.vl_dolina_qj = false
    },
    forced: true,
    unique: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "metal",
    async content(event, trigger, player) {
        player.awakenSkill('vl_dolina_qj');
        player.logSkill('vl_dolina_qj');
        await player.recover(player.getDamagedHp());
        player.addSkill('vl_dolina_fh');
    },
    derivation: "vl_dolina_fh",
    t: {
        name: "权聚",
        info: `觉醒技，当你删除了${get.poptip("vl_dolina_sl")}中的所有记录后，你将体力值调整至体力上限，并获得${get.poptip("vl_dolina_fh")}。`,
    },
};
