import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    trigger: {
        global: "phaseBefore",
        player: "enterGame",
    },
    filter: function filter(event,player){
					return event.name != "phase" || game.phaseNumber == 0;
				},
    init: function (player) {
					if (!player.storage.vl_dolina_sl) player.storage.vl_dolina_sl = [[], [], []]
				},
    forced: true,
    content: function () {
					for (var i of lib.inpile) {
						var card = { name: i, isCard: true };
						if (get.tag(card, 'damage')) {
							if (get.type(i) == 'trick') {
								player.storage.vl_dolina_sl[0].push(['锦囊', '', i])
							}
						};
					}
					player.storage.vl_dolina_sl[0].push(['基本', '', 'sha']);
					for (var j of lib.inpile_nature) player.storage.vl_dolina_sl[0].push(['基本', '', 'sha', j]);
					player.storage.vl_dolina_sl[1] = player.storage.vl_dolina_sl[0].slice(0)
				},
    group: "vl_dolina_sl_use",
    subSkill: {
        use: {
            enable: "phaseUse",
            direct: true,
            filter: function (event, player) {
							return player.storage.vl_dolina_sl[1].length > 0 && player.countCards('hes') > 0
						},
            chooseButton: {
                dialog: function (event, player) {
								return ui.create.dialog('噬浪', [player.storage.vl_dolina_sl[1], 'vcard']);
							},
                filter: function (button, player) {
								return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
							},
                check: function (button) {
								var player = _status.event.player;
								return player.getUseValue({ name: button.link[2] });
							},
                backup: function (links, player) {
								return {
									filterCard: true,
									selectCard: 1,
									check: function (card) {
										if (ui.selected.cards.length) return 0;
										return 7 - get.value(card);
									},
									position: 'h',
									popname: true,
									viewAs: {
										name: links[0][2],
										nature: links[0][3]
									},
									onuse: function (result, player) {
										var recode = [get.translation(get.type2(result.card)), '', get.name(result.card)]
										if (result.card.nature) recode.push(result.card.nature)
										let index = player.storage.vl_dolina_sl[1].findIndex(subArr => JSON.stringify(subArr) === JSON.stringify(recode));
										// 如果找到了子数组 recode，则将其从 A 中删除
										if (index !== -1) {
											player.storage.vl_dolina_sl[1].splice(index, 1);
										}
										player.storage.vl_dolina_sl[2].push(recode)
										if (!player.storage.vl_dolina_qj && player.storage.vl_dolina_sl[1].length == 0 && player.hasSkill('vl_dolina_qj')) {
											var next = game.createEvent('vl_dolina_qj', false);
											next.player = player;
											next.setContent(lib.skill.vl_dolina_qj.content);
										}
									},
								}
							},
                prompt: function (links, player) {
								return '将一张牌当作' + get.translation(links[0][3]) + get.translation(links[0][2]) + '使用';
							},
            },
            ai: {
                order: 6,
                result: {
                    player: 2,
                },
            },
        },
    },
    t: {
        name: "噬浪",
        info: "游戏开始时，你记录牌堆中带有伤害标签的牌名；出牌阶段，你可以删除一个记录牌将一张手牌当成此牌使用。",
    },
};
