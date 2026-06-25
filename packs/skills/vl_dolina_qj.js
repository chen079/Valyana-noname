import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    init: function (player) {
					if (!player.storage.vl_dolina_qj) player.storage.vl_dolina_qj = false
				},
    forced: true,
    unique: true,
    juexingji: true,
    skillAnimation: true,
    animationColor: "metal",
    content: function () {
					'step 0'
					player.awakenSkill('vl_dolina_qj')
					player.logSkill('vl_dolina_qj')
					'step 1'
					player.recover(player.getDamagedHp())
					player.addSkill('vl_dolina_fh')
				},
    derivation: "vl_dolina_fh",
    t: {
        name: "权聚",
        info: "觉醒技，当你删除了「vl_dolina_sl」中的所有记录后，你将体力值调整至体力上限，并获得「vl_dolina_fh」。",
    },
};
