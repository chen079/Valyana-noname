import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        player: ["loseAfter"],
    },
    juexingji: true,
    skillAnimation: true,
    animationColor: "gray",
    forced: true,
    init: function (player) {
					player.addSkill("vl_sainit_yq_count");
					if (!player.storage.vl_sainit_yq) player.storage.vl_sainit_yq = false
				},
    filter: function (event, player) {
					if(event.getParent(3).name!="vl_sainit_jh_discard")return;
					if(!(event.type == "discard" && event.getl(player)?.cards2?.length))return;
					return player.countMark("vl_sainit_yq_count")>=12;
				},
    content: function () {
					'step 0'
					player.awakenSkill('vl_sainit_yq')
					player.storage.vl_sainit_yq = true
					player.unmarkSkill('vl_sainit_yq')
					player.addSkill('vl_sainit_yj')
					game.log(player, '移除了', '#g【镜华②】')
				},
    derivation: "vl_sainit_yj",
    subSkill: {
        count: {
            trigger: {
                player: ["loseAfter"],
            },
            mark: true,
            marktext: "影",
            intro: {
                name: "影倾",
                mark: function mark(dialog, storage, player) {
								dialog.addText("你因【镜华】弃置了"+(player.countMark("vl_sainit_yq_count") || 0) +"张牌");
							},
            },
            forced: true,
            firstDo: true,
            charlotte: true,
            filter: function (event, player) {
							if(event.getParent(3).name!="vl_sainit_jh_discard")return;
							if(!(event.type == "discard" && event.getl(player)?.cards2?.length))return;
							return true;
							// return event.type == "discard" && event.getl(player).cards2.length;
						},
            content: function content(){
							player.addMark("vl_sainit_yq_count",trigger.getl(player)?.cards2?.length);
						},
        },
    },
    t: {
        name: "影倾",
        info: "觉醒技，当你因「vl_sainit_jh」②累计弃置不小于12张牌时,你获得「vl_sainit_yj」并移除「vl_sainit_jh」②。",
    },
};
